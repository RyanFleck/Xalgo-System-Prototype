import PropTypes from 'prop-types';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { css } from '@styled-system/css';

/**
 * A button.
 */
const Button = styled.button(
  css({
    boxSizing: 'border-box',
    display: 'inline-block',
    px: 1,
    py: '4px',
    textAlign: 'left',
    border: 'thin',
    color: 'primary',
    borderColor: 'primary',
    backgroundColor: 'bg',
    borderRadius: '3px',
    fontFamily: 'body',
    fontSize: 'md',
    textDecoration: 'none',
    userSelect: 'none',

    // We can't use :enabled here because it doesn't work with <a>
    '&:hover:not(:disabled), &:active:not(:disabled)': {
      color: 'primary',
      cursor: 'pointer',
      outline: 'none',
    },

    '&:focus': {
      color: 'primary',
      borderColor: 'bg',
      backgroundColor: 'bg',
      outline: 'none',
    },

    '&:disabled': {
      color: 'lgrey',
      borderColor: 'oline',
    },
  }),
  variant({
    variants: {
      primary: {
        color: 'background',
        backgroundColor: 'primary',
      },
      secondary: {
        backgroundColor: 'bg',
      },
      wide: {
        background: 'none',
        width: '100%',
      },
      invisible: {
        borderRadius: 'base',
        background: 'none',
        boxShadow: 'none',
        border: 'none',
        px: 0,
        py: 0,
        color: 'text',
        '&:hover:not(:disabled), &:active:not(:disabled)': {
          background: 'none',
          cursor: 'pointer',
          boxShadow: 'none',
          color: 'text',
          borderColor: 'none',
        },
      },
      invisiblewide: {
        borderRadius: 'base',
        background: 'none',
        boxShadow: 'none',
        border: 'none',
        px: 0,
        py: 0,
        width: '100%',
        '&:hover:not(:disabled), &:active:not(:disabled)': {
          cursor: 'pointer',
          boxShadow: 'none',
        },
      },
      error: {
        backgroundColor: '#D0F3E2',
        borderColor: '#D0F3E2',
        width: '100%',
        textAlign: 'center',
        color: '#439D72',
        '&:hover:not(:disabled), &:active:not(:disabled)': {
          cursor: 'pointer',
          boxShadow: 'none',
          backgroundColor: '#A3D8BE',
          color: '#439D72',
        },
      },
      blue: {
        backgroundColor: 'primary',
        textAlign: 'center',
        width: '100%',
        color: '#fff',
        '&:hover:not(:disabled), &:active:not(:disabled)': {
          cursor: 'pointer',
          boxShadow: 'none',
          color: '#DBEAFF',
        },
      }
    },
  })
);

Button.propTypes = {
  /** Button label */
  children: PropTypes.node,
};

Button.defaultProps = {
  variant: 'secondary',
};

/** @component */
export default Button;
