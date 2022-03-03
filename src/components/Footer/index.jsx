import React from 'react'
import styled from 'styled-components'

import TwitterIcon from 'assets/img/twitter.svg'
import TelegramIcon from 'assets/img/telegram.svg'
import MediumIcon from 'assets/img/medium.svg'
import DiscordIcon from 'assets/img/Discord-Logo-White.svg'

const Footer = () => {
  return (
    <StyledFooter>
      <StyledFooterInner>
        <FooterText>© 2021 All rights reserved.</FooterText>
        <IconContainer>
          <FooterIcon
            src={TwitterIcon}
            onClick={() => {
              window.open('https://twitter.com/MonoXFinance')
            }}
          />
          <FooterIcon
            src={TelegramIcon}
            onClick={() => {
              window.open('https://t.me/MonoXOfficial')
            }}
          />
          <FooterIcon
            src={DiscordIcon}
            style={{ opacity: '0.9' }}
            onClick={() => {
              window.open('https://discord.gg/Myeht7gcbd')
            }}
          />
          <FooterIcon
            src={MediumIcon}
            onClick={() => {
              window.open('https://medium.com/monoswap')
            }}
          />
        </IconContainer>
      </StyledFooterInner>
    </StyledFooter>
  )
}

const StyledFooter = styled.div`
  height: 64px;
  background-color: #3dcf97;
  color: #ffffff;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  display:none`}
`
const StyledFooterInner = styled.div`
  margin: 0 95px 0 80px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`
const FooterText = styled.span`
  margin: 0;
  font-family: Nunito;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
`
const FooterIcon = styled.img`
  margin: 0 15px;
  height: 18px;
  width: 22px;
  cursor: pointer;
`

const IconContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`

export default Footer
