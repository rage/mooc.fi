import styled from "styled-components"

export const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`

export const FullCoverTextBackground = styled.span`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  display: flex;
  flex-direction: column;
`
