import classNames from 'classnames';
import React, { cloneElement } from 'react';
import uncontrollable from 'uncontrollable';

import { bsClass, getClassSet, splitBsPropsAndOmit }
  from './utils/bootstrapUtils';
import ValidComponentChildren from './utils/ValidComponentChildren';
import { generatedId } from './utils/PropTypes';


const propTypes = {
  accordion: React.PropTypes.bool,
  activeKey: React.PropTypes.any,
  onSelect: React.PropTypes.func,
  role: React.PropTypes.string,

  /**
   * A function that takes an eventKey and type and returns a
   * unique id for each Panel heading and Panel Collapse. The function _must_ be a pure function,
   * meaning it should always return the _same_ id for the same set of inputs. The default
   * value requires that an `id` to be set for the PanelGroup.
   *
   * The `type` argument will either be `"COLLAPSE"` or `"HEADING"`.
   *
   * @defaultValue (eventKey, type) => `${this.props.id}-${type}-${key}`
   */
  generateChildId: React.PropTypes.func,

  /**
   * HTML id attribute, required if no `generateChildId` prop
   * is specified.
   */
  id: generatedId('PanelGroup')
};

const defaultProps = {
  accordion: false,
};

const childContextTypes = {
  $bs_panelGroup: React.PropTypes.shape({
    getId: React.PropTypes.func,
    headerRole: React.PropTypes.string,
    panelRole: React.PropTypes.string,
  })
};

class PanelGroup extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);
  }

  getChildContext() {
    const { accordion, generateChildId, id } = this.props;
    let getId = null;

    if (accordion) {
      getId = generateChildId
        || ((key, type) => id ? `${id}-${type}-${key}` : null);
    }

    return {
      $bs_panelGroup: {
        getId,
        headerRole: 'tab',
        panelRole: 'tabpanel',
      },
    };
  }

  handleSelect(key, expanded, e) {
    if (expanded) {
      this.props.onSelect(key, e);
    }
  }

  render() {
    const {
      accordion,
      activeKey,
      className,
      children,
      ...props,
    } = this.props;

    const [bsProps, elementProps] = splitBsPropsAndOmit(props, ['onSelect']);

    if (accordion) {
      elementProps.role = elementProps.role || 'tablist';
    }

    const classes = getClassSet(bsProps);

    return (
      <div
        {...elementProps}
        className={classNames(className, classes)}
      >
        {ValidComponentChildren.map(children, (child, index) => {
          const childProps = {
            bsStyle: child.props.bsStyle || bsProps.bsStyle,
            key: child.key ? child.key : index,
          };

          if (accordion) {
            Object.assign(childProps, {
              collapsible: true,
              expanded: (child.props.eventKey === activeKey),
              onToggle: this.handleSelect.bind(null, child.props.eventKey),
            });
          }

          return cloneElement(child, childProps);
        })}
      </div>
    );
  }
}

PanelGroup.propTypes = propTypes;
PanelGroup.defaultProps = defaultProps;
PanelGroup.childContextTypes = childContextTypes;

export default uncontrollable(
  bsClass('panel-group', PanelGroup),
  {
    activeKey: 'onSelect'
  }
);
