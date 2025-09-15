(function(window) {
  console.log("✅ Script loaded and executing.");
  console.log("✅ GitHub Publoshing no 1.");

  function getBloodPressureValue(BPObservations, typeOfPressure) {
    const formattedBPObservations = [];

    BPObservations.forEach(observation => {
      const BP = observation.component?.find(component =>
        component.code?.coding?.find(coding => coding.code === typeOfPressure)
      );
      if (BP) {
        observation.valueQuantity = BP.valueQuantity;
        formattedBPObservations.push(observation);
      }
    });

    return getQuantityValueAndUnit(formattedBPObservations[0]);
  }

  function getQuantityValueAndUnit(ob) {
    if (
      ob?.valueQuantity?.value !== undefined &&
      ob.valueQuantity.unit !== undefined
    ) {
      return `${ob.valueQuantity.value} ${ob.valueQuantity.unit}`;
    }
    return undefined;
  }

  function getComponentValue(observations, loincCode) {
    for (const obs of observations) {
      const component = obs.component?.find(c =>
        c.code?.coding?.some(coding => coding.code === loincCode)
      );
      if (component?.valueQuantity) {
        return `${component.valueQuantity.value} ${component.valueQuantity.unit}`;
      }
    }
    return undefined;
  }

  function defaultPatient() {
    return {
      fname: '',
      lname: '',
      gender: '',
      birthdate: '',
      height: '',
      systolicbp: '',
      diastolicbp: '',
      ldl: '',
      hdl: ''
    };
  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#height').html(p.height);
    $('#systolicbp').html(p.systolicbp);
    $('#diastolicbp').html(p.diastolicbp);
    $('#ldl').html(p.ldl);
    $('#hdl').html(p.hdl);
  };

  FHIR.oauth2.ready()
    .then(client => {
      console.log("SMART client initialized.");
      console.log("Requesting Observations for patient:", client.patient.id);

      const patientPromise = client.request(`Patient/${client.patient.id}`);
      const observationPromise = client.request('Observation', {
        patient: client.patient.id,
        code: [
          'http://loinc.org|8302-2',
          'http://loinc.org|8462-4',
          'http://loinc.org|8480-6',
          'http://loinc.org|2085-9',
          'http://loinc.org|2089-1',
          'http://loinc.org|55284-4'
        ].join(',')
      });

      Promise.all([patientPromise, observationPromise])
        .then(([patient, observations]) => {
          if (!observations || !observations.entry || observations.entry.length === 0) {
            console.warn("No observations returned from filtered query. Trying broader query...");
            return client.request(`Observation?patient=${client.patient.id}`)
              .then(allObservations => {
                console.log("Broad Observation query result:", allObservations);
                return [patient, allObservations];
              });
          } else {
            console.log("Filtered Observations:", observations);
            return [patient, observations];
          }
        })
        .then(([patient, observations]) => {
          const resources = observations.entry?.map(e => e.resource) || [];
          console.log("Parsed Observation resources:", resources);

          const byCodes = client.byCodes(resources, 'code');
          const p = defaultPatient();

          p.fname = patient.name?.[0]?.given?.join(' ') || '';
          p.lname = patient.name?.[0]?.family || '';
          p.gender = patient.gender || '';
          p.birthdate = patient.birthDate || '';
          p.height = getQuantityValueAndUnit(byCodes('8302-2')?.[0]);

          // HDL and LDL with fallback to component parsing
          p.hdl = getQuantityValueAndUnit(byCodes('2085-9')?.[0]) || getComponentValue(resources, '2085-9');
          p.ldl = getQuantityValueAndUnit(byCodes('2089-1')?.[0]) || getComponentValue(resources, '2089-1');

          // Blood pressure logic with fallback
          const bpPanel = byCodes('55284-4');
          if (bpPanel?.length) {
            p.systolicbp = getBloodPressureValue(bpPanel, '8480-6');
            p.diastolicbp = getBloodPressureValue(bpPanel, '8462-4');
          } else {
            console.warn("No BP panel found. Checking standalone systolic/diastolic...");
            const systolic = byCodes('8480-6')?.[0];
            const diastolic = byCodes('8462-4')?.[0];
            p.systolicbp = getQuantityValueAndUnit(systolic);
            p.diastolicbp = getQuantityValueAndUnit(diastolic);
          }

          window.drawVisualization(p);
        })
        .catch(error => {
          console.error('Failed to call FHIR Service', error);
          $('#loading').hide();
          $('#errors').html('<p> Failed to call FHIR Service </p>');
        });
    })
    .catch(error => {
      console.error('Failed to initialize SMART client', error);
      $('#loading').hide();
      $('#errors').html('<p> Failed to initialize SMART client </p>');
    });
})(window);
