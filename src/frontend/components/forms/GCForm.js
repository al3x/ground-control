import React from 'react';
import Form from 'react-formal';
import GCSubmitButton from './GCSubmitButton';
import {RefreshIndicator} from 'material-ui';
import {BernieColors} from '../styles/bernie-css';

export default class GCForm extends React.Component {
  state = {
    formErrors: null,
    isSubmitting: false
  }

  renderChildren(children) {
    return React.Children.map(children, (child) => {
      if (child.type === Form.Field) {
        let name = child.props.name;
        let error = this.state.formErrors ? this.state.formErrors[name] : null;
        let clonedElement = child

        if (error) {
          error = error[0] ? error[0].message.replace(name, child.props.label) : null;
          clonedElement = React.cloneElement(child, {
            errorText: error
          })
        }

        return React.cloneElement(clonedElement, {
          events: ['onBlur']
        })
      } else if (child.type === Form.Button) {
        return React.cloneElement(child, {
          component: GCSubmitButton
        })
      } else if (child.props && child.props.children) {
        return React.cloneElement(child, {
          children: this.renderChildren(child.props.children)
        })
      } else {
        return child;
      }
    })
  }

  render() {
    let globalSnack = <div></div>

    if (this.props.globalError) {
      globalSnack = <Snackbar
        message={this.props.globalError}
        autoHideDuration={10000}
        openOnMount={true}
        style={{'backgroundColor' : BernieColors.red}}
        action={null} />
    } else if (this.props.globalStatus) {
      globalSnack = <Snackbar
        message={this.props.globalStatus}
        autoHideDuration={10000}
        openOnMount={true}
        style={{'backgroundColor' : BernieColors.blue}}
        action={null} />
    }

    return (
        <Form
          onError={(errors) => {
            this.setState({formErrors: errors})
          }}
          {...this.props} >
          {this.renderChildren(this.props.children)}
        </Form>
    )
  }
}
