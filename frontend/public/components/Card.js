'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Card = ({path,data}) => {

    const [currData, setData] = useState(data);
    const router = useRouter();
    const handleClick = (e) => {
        e.preventDefault();
        const jsonData = JSON.stringify(data);
        localStorage.setItem('data', jsonData);
        router.push(`${path}${data.id}`);
    }

    return (
        <a className ='border-5' onClick={handleClick}>
        {/* <Link  legacyBehavior href={{ pathname: `${path}${account.id}`, query: { data: JSON.stringify(account) } }}> */}
            <div className='border-5  border-rose-500'>
                {Object.keys(data).map((key) => (
                    <p> {key}: {data[key]+""}</p>
                ))}
            </div>
        {/* </Link> */}
        </a>
    );
};

export default Card;