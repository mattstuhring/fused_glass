var React = require('react');
var {FormGroup, FormControl, ControlLabel, HelpBlock}
  = require('react-bootstrap');

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

module.exports = FieldGroup;
