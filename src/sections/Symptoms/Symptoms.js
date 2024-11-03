import React from 'react';
import './Symptoms.scss';
import IconList from '../../components/IconList/IconList';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import iconOne from '../../assets/symptoms/1.png';
import iconTwo from '../../assets/symptoms/2.png';
import iconThree from '../../assets/symptoms/3.png';
import iconFour from '../../assets/symptoms/4.png';
import iconFive from '../../assets/symptoms/5.png';

const Symptoms = () => {
    const symptomsData = [
        {
            'icon' : iconOne,
            'title' : 'Aniden gelişen ağrı',
            'description':'Yemek yemediğinizde veya içmediğinizde bile aniden gelişen ağrı' 
        },
        {
            'icon' : iconTwo,
            'title' : 'Dişin renginin değişmesi',
            'description':'Dişin koyulaşması veya renginin değişmesi' 
        },
        {
            'icon' : iconThree,
            'title' : 'Gece yarısı ağrısı',
            'description':'Gece yarısı sizi uyandıran ağrı' 
        },
        {
            'icon' : iconFour,
            'title' : 'Diş etlerinde hassasiyet',
            'description':'From floss bosses to sweet tooths, every mouth is welcome.' 
        },
        {
            'icon' : iconFive,
            'title' : 'Extreme sensitivity',
            'description':'Extreme sensitivity to cold or heat when your’e drink or eat' 
        }
    ]

    return (
        <section className='symptoms-section section-common pt-100 pb-70' data-aos="fade-up" data-aos-duration="2000">
            <div className="container">
                <SectionTitle 
                    subTitle="Semptomlar"
                    title="Kanal tedavi yaptırmanıza işaret eden durumlar ve semptomlar "
                    description="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
                />

                <div className="row">
                    {
                        symptomsData.map(singleSymptoms => 
                            <IconList 
                                icon={singleSymptoms.icon}
                                title={singleSymptoms.title}
                                description={singleSymptoms.description}
                            />
                        )
                    }
                </div>
            </div>
        </section>
    );
};

export default Symptoms;