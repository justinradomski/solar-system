"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Home() {

  // Set up the solar system
  const solarSystem = [
    {
      name: 'Sun',
      distance: 0,
      diameter: 865370,
      image: '/Sun.svg',
      moons: 0,
      orbitalPeriod: 'N/A',
      funFact: 'The Sun contains more than 99.85% of the total mass of our entire solar system.'
    },
    {
      name: 'Mercury',
      distance: 36000000,
      diameter: 3032,
      image: '/Mercury.svg',
      moons: 0,
      orbitalPeriod: '88 days',
      funFact: 'Mercury has no atmosphere, which means it has no weather.'
    },
    {
      name: 'Venus',
      distance: 67200000,
      diameter: 7521,
      image: '/Venus.svg',
      moons: 0,
      orbitalPeriod: '225 days',
      funFact: 'Venus rotates in the opposite direction of most planets, including Earth.'
    },
    {
      name: 'Earth',
      distance: 93000000,
      diameter: 7926,
      image: '/Earth.svg',
      moons: 1,
      orbitalPeriod: '365.25 days',
      funFact: 'Earth is the only planet known to support life. That\'s where we live\!'
    },
    {
      name: 'Mars',
      distance: 142000000,
      diameter: 4212,
      image: '/Mars.svg',
      moons: 2,
      orbitalPeriod: '687 days',
      funFact: 'Mars is often called the "Red Planet" due to its reddish appearance.'
    },
    {
      name: 'Jupiter',
      distance: 484000000,
      diameter: 86881,
      image: '/Jupiter.svg',
      moons: 79, // Known as of 2022
      orbitalPeriod: '11.9 years',
      funFact: 'Jupiter has the shortest day of all the planets; it rotates once about every 10 hours.'
    },
    {
      name: 'Saturn',
      distance: 886000000,
      diameter: 72367,
      image: '/Saturn.svg',
      moons: 83, // Known as of 2022
      orbitalPeriod: '29.5 years',
      funFact: 'Saturn can be seen with the naked eye and is known for its stunning system of rings.'
    },
    {
      name: 'Uranus',
      distance: 1784000000,
      diameter: 31518,
      image: '/Uranus.svg',
      moons: 27,
      orbitalPeriod: '84 years',
      funFact: 'Uranus rotates on its side, making it unique among the solar system planets.'
    },
    {
      name: 'Neptune',
      distance: 2793000000,
      diameter: 30599,
      image: '/Neptune.svg',
      moons: 14,
      orbitalPeriod: '164.8 years',
      funFact: 'Neptune was the first planet to be found using mathematical predictions rather than telescopic observation.'
    }
  ]

  const scale = 865.37 // 1px = 865.37 mi

  // This state will store the scroll progress
  const [scrollX, setScrollX] = useState(0);

  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      // This gets the horizontal scroll value
      const currentScrollX = window.scrollX;

      setScrollX(currentScrollX);
    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // This moves the background at 1% the speed of the horizontal scroll
    const parallaxEffectValue = scrollX * 0.01;

    // Use framer-motion to animate the star pattern
    controls.start({ x: -parallaxEffectValue });
  }, [scrollX, controls]);

  let distance = Math.round(scrollX * scale)
  // add commas to the distance
  distance = distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <main className="relative h-screen overflow-y-clip w-max">
      <motion.div 
        animate={controls}
        transition={{
          type: 'tween',
          ease: 'linear',
          duration: 0,
        }}
        className={`stars fixed top-0 left-0 h-full bg-repeat`}
        style={{
          backgroundImage: `url(/Stars.svg)`,
          backgroundSize: `250px`,
          width: `${(solarSystem[solarSystem.length - 1].distance / scale) * .01}px`,
        }}
        />
      <div 
        className={`bodies relative h-full flex items-center`}
        style={{
          width: `${solarSystem[solarSystem.length - 1].distance / scale}px`,
        }}
        >
        {solarSystem.map((planet) => {
          // Calculate the scaled distance in pixels
          const leftDistance = planet.distance / scale;
          
          return (
            <Image
              key={planet.name}
              src={planet.image}
              alt={planet.name}
              width={planet.name === 'Saturn' ? planet.diameter / scale * 1.75 : planet.diameter / scale}
              height={planet.diameter / scale}
              className={`absolute -translate-x-1/2
                ${planet.name === 'Sun' ? '' : 'animate-float'}
              `}
              style={{ left: `${leftDistance}px` }}
            />
          );
        })}
      </div>
      <div className={`planet-labels w-full h-[200px] flex items-center justify-center fixed bottom-[100px]`}>
        {solarSystem.map((planet) => {
          if(planet.distance <= 0) return

          // determine when the planet is in view
          const windowWidth = window.innerWidth
          const planetLeft = planet.distance / scale
          const planetRight = planetLeft + (planet.diameter / scale)
          const inView = planetLeft > scrollX && planetRight < scrollX + windowWidth

          return (
            <div
              key={planet.name}
              className={`
                absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                flex flex-col items-center justify-center text-center
                w-full max-w-[600px] bg-[#1e1d31] rounded-xl p-4 border border-white
                transition-all
                ${inView ? 'opacity-100' : 'opacity-0'}
                `}
            >
              <div className={`text-white text-3xl`}>{planet.name}</div>
              <div className={`text-white`}>{planet.funFact}</div>
            </div>
          )
        })}
      </div>
      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center`}>
        Distance from Sun: <span className={`text-white`}>{distance} miles</span>
      </div>
    </main>
  )
}
