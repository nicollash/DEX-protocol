import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { black, grey, red, white } from 'theme/colors'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}

const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    accumulator[size] = (a, b, c) => css`
      @media (max-width: ${MEDIA_WIDTHS[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
)

const theme = {
  borderRadius: 12,
  breakpoints: [400],
  color: {
    black,
    grey,
    red,
    primary: {
      light: '#41dba0',
      main: '#2dc48f',
    },
    secondary: {
      main: '#202b65',
    },
    white,
    background: {
      main: '#f5f5f8', //#
      secondary: '#ecf3f0',
      paleGrey: '#f5f5f8',
    },
    button: {
      error: '#ef3d62',
      green: '#41dea2',
      main: '#41dea2',
      light: '#ef3d62',
      disable: '#abb1c5',
      hover: {
        main: '#41dba0',
        light: '#e63a5d',
        error: 'rgba(207, 53, 85, 0.3)',
      },
    },
    font: {
      warning: '#e28156',
      error: '#ef3d62',
      green: '#41dea2',
      primary: '#2eca93',
      secondary: '#212d63',
    },
    seperator: {
      top: '#212d63',
      bottom: '#ffffff',
    },
    tertiary: {
      main: '#151d40',
    },
    redPink: '#ef3d62',
    border: {
      primary: '#d7dee8',
      green: '#41dea2',
    },
  },
  siteWidth: 1200,
  spacing: {
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 48,
    7: 64,
    19: 150,
  },
  topBarSize: 64,
  footerSize: 64,
  flexColumnNoWrap: css`
    display: flex;
    flex-flow: column nowrap;
  `,
  flexRowNoWrap: css`
    display: flex;
    flex-flow: row nowrap;
  `,
  mediaWidth: mediaWidthTemplates,
  shadows: {
    insetFocus: ` 0 0 10px 0 rgba(65, 222, 162, 0.31), inset 6px 6px 20px 0 #d0d8e6, inset -6px -6px 20px 0 #ffffff !important`,
    inset: `inset 6px 6px 20px 0 #d0d8e6, inset -6px -6px 20px 0 #ffffff !important`,
    thin: `18px 18px 30px 0 rgba(208, 216, 230, 0.8), -18px -18px 30px 0 rgba(255, 255, 255, 0.7), -4px -4px 4px 0 rgba(255, 255, 255, 0.5) !important`,
    thick: `12px 12px 20px 0 rgba(208, 216, 230, 0.8), -12px -12px 20px 0 rgba(255, 255, 255, 0.7), -4px -4px 4px 0 #f6f8fe !important`,
    card: `10px 10px 20px 0 rgba(208, 216, 230, 0.8), -10px -10px 20px 0 rgba(255, 255, 255, 0.7), -4px -4px 4px 0 rgba(255, 255, 255, 0.5);`,
  },
  inputFocusBorder: `
  box-shadow: 0 0 10px 0 rgba(65, 222, 162, 0.3), inset -6px -6px 10px 0 #ffffff, inset 6px 6px 10px 0 rgba(208, 216, 230, 0.8);
  border-style: solid !important;
  border-width: 1.5px !important;
  border-image-source: linear-gradient(106deg, #41dea2 4%, #ba78f0) !important;
  background-image: linear-gradient(to bottom, #f5f5f8, #f5f5f8), linear-gradient(106deg, #41dea2 4%, #ba78f0) !important;
  background-origin: border-box !important;
  background-clip: content-box, border-box !important;
  transition: all 0.3s ease-out;`,
}

export const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`

export const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
  svg {
    margin-left: 5px;
    * {
      color: #2dc48f;
    }
  }
`

export const StyledInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: #ff007a;
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export default theme
