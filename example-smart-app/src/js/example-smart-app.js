(function(window) {
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
          const byCodes = client.byCodes(observations, 'code');
          const p = defaultPatient();

          p.fname = patient.name?.[0]?.given?.join(' ') || '';
          p.lname = patient.name?.[0]?.family || '';
          p.gender = patient.gender || '';
          p.birthdate = patient.birthDate || '';
          p.height = getQuantityValueAndUnit(byCodes('8302-2')?.[0]);
          p.systolicbp = getBloodPressureValue(byCodes('55284-4'), '8480-6');
          p.diastolicbp = getBloodPressureValue(byCodes('55284-4'), '8462-4');
          p.hdl = getQuantityValueAndUnit(byCodes('2085-9')?.[0]);
          p.ldl = getQuantityValueAndUnit(byCodes('2089-1')?.[0]);

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

