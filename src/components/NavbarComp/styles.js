import styled from "styled-components"
export const WrapperLabelText= styled.h4`
    color: var(--text-color);
    font-weight: 600;
    font-size:1.8rem;
`

export const WrapperTextValue= styled.span`
    color: var(--text-color);
    font-weight: 400;
    font-size:1.2rem;
`

export const WrapperContent= styled.div`
    display:flex;
    flex-direction: column;
    // align-items:center;
    gap:12px;
`
export const WrapperTextPrice = styled.div`
    border-radius: 10px;
    background-color: var(--background-color);
    width: fit-content;
    padding: 4px;
    color: var(--text-color);
`