import React,{useRef, useEffect}from 'react';
import styled from 'styled-components';
import {Link,Kanca } from "../components/AllSvgs";

    const Container = styled.div`
    position: relative;

    
    `

    const Slider = styled.div`
        position: fixed; 
        top: 0;
        right: 2rem;
        display: flex;
        justify-content: center;
        align-content: center; 
        flex-direction: column;
        transform: translateY(-100%);


        .zincir {
          
            transform: rotate(135deg)
            
        }

        @media screen and (max-width: 800px) {
              
            right: 0.5rem;        
          
        }
    `

    

const KancaSup = (props) => {

    const ref = useRef(null);
    const hiddenRef = useRef(null);

    useEffect(()=>{

        const handleScroll = () => {
            let scrollPosition = window.pageYOffset;
            let windowSize = window.innerHeight;
            let bodyHeight = document.body.offsetHeight;

            let diff = Math.max(bodyHeight - (scrollPosition + windowSize))

            let farkpozisyonu = (diff * 100) / (bodyHeight - windowSize);

            ref.current.style.transform = `translateY(${-farkpozisyonu}%)`;

            if(window.pageYOffset > 5) {
                hiddenRef.current.style.display = 'none';
            }else {

                hiddenRef.current.style.display = 'block';
            }
        }
        
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    const PreDisplay = styled.div`
        position: absolute;
        top: 0;
        right: 3rem;
    `

  return (
    <Container>
        <PreDisplay ref={hiddenRef} className="hidden">

        <Kanca className="" width={100} height={75} fill='currentColor' />
        </PreDisplay>
        <Slider ref={ref}>
            {
                [...Array(props.numbers)].map((x,id) => {
                    return <Link key={id} width={100} height={25} fill='currentColor' className="zincir"/>
                })
            }

            <Kanca width={100} height={75} fill='currentColor' />
        </Slider>
    </Container>
  )
}

export default KancaSup