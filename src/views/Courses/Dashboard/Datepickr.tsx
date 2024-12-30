// import dynamic from 'next/dynamic';
// import React, { useEffect, useRef } from 'react';
// import { Datepicker } from 'vanillajs-datepicker'; 
// import 'vanillajs-datepicker/css/datepicker-bulma.css'

// const InlineDatepicker = () => {
//     const datepickerRef = useRef(null);

//     useEffect(() => {
//         if (datepickerRef.current) {
//             const datepicker = new Datepicker(datepickerRef.current, {
//                 buttonClass: 'btn'
//             });

//             // Cleanup function to destroy the datepicker instance
//             return () => {
//                 datepicker.destroy();
//             };
//         }
//     }, []);

//     return (
//         <div id="pc-datepicker-6" ref={datepickerRef}></div>
//     );
// };

// export default InlineDatepicker;

import React, { useEffect, useRef } from 'react';
import { Datepicker } from 'vanillajs-datepicker';
import 'vanillajs-datepicker/css/datepicker-bulma.css';

const InlineDatepickerComponent = () => {
    const datepickerRef = useRef(null);

    useEffect(() => {
        if (datepickerRef.current) {
            const datepicker = new Datepicker(datepickerRef.current, {
                buttonClass: 'btn'
            });

            // Cleanup function to destroy the datepicker instance
            return () => {
                datepicker.destroy();
            };
        }
    }, []);

    return (
        <div id="pc-datepicker-6" ref={datepickerRef}></div>
    );
};

export default InlineDatepickerComponent;
