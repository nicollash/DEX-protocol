import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import home from 'assets/img/home.svg'
import pool from 'assets/img/pool.svg'
import swap from 'assets/img/swapNav.svg'
import farm from 'assets/img/farm.svg'

const NavButtons = () => {
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  return (
    <StyledNavButtons>
      <StyledLink to="/" exact>
        <div>
          <img src={home} alt="home" />
          <Span>Home</Span>
        </div>
      </StyledLink>
      <StyledLink variant="nav" to={`/swap?network=${networkName}`}>
        <div>
          <img src={swap} alt="swap" />
          <Span>Swap</Span>
        </div>
      </StyledLink>
      <StyledLink variant="nav" to={`/pool?network=${networkName}`} exact>
        <div>
          <img src={pool} alt="pool" />
          <Span>Pool</Span>
        </div>
      </StyledLink>
      <StyledLink variant="nav" to={`/farm?network=${networkName}`} exact>
        <div>
          <img src={farm} alt="farm" />
          <Span>Farm</Span>
        </div>
      </StyledLink>
    </StyledNavButtons>
  )
}

const StyledNavButtons = styled.div`
  display: flex;
  margin-left: auto;
  height: 100%;
  width: 'auto';
  .active {
    div {
      border-bottom: ${({ theme }) => `4px solid ${theme.color.font.green}`};
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-evenly;
    justify-self: center;
    padding:0 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.color.background.main};
    box-shadow:0 5px 20px 0 #d1d9e6, -18px -18px 30px 0 rgb(255 255 255 / 50%)
  `};
`

const Span = styled.span`
  color: ${({ theme }) => theme.color.secondary.main};
  font-size: 14px;
  font-weight: bold;
  @media (max-width: 1024px) {
    display: none;
  }
`

const StyledLink = styled(NavLink)`
  cursor: pointer;
  padding: 2px 22px;
  text-decoration: none;
  transition: color 0.2s ease, background-color 0.2s ease,
    border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  & img {
    margin-right: 9px;
  }
  @media (max-width: 1024px) {
    & img {
      margin-right: 0px;
    }
  }
  div {
    padding: 0 4px;
    height: 100%;
    display: flex;
    align-items: center;
    :active {
      transform: translateY(-2px);
    }
    :focus {
      transform: translateY(-2px);
    }
    :hover {
      transform: translateY(-2px);
      span {
        color: ${({ theme }) => theme.color.font.green};
      }
    }
  }
  @media (max-width: 1400px) {
    padding: 2px 10px;
  }
`
export default NavButtons
