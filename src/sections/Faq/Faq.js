import React from 'react';
import './Faq.scss';
import SectionTitle from '../../components/SectionTitle/SectionTitle';

const Faq = () => {
    return (
        <section className='faq-section pt-100 pb-70'  data-aos="fade-up" data-aos-duration="2000">
            <div className="container">
                <SectionTitle
                    subTitle="SSS"
                    title="Sıkça sorulan sorular"
                />

                <div className="accordian-area">
                    <div class="accordion" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                               Sigara içen birinde diş beyazlatma işlemi yapılır mı?Etkisi ne kadar sürer?
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                   Diş beyazlatma sonrası ilk günlerde dişler renk değişiklerine hassastır.Doktorunuzun önerdiği süre boyunca sigaraya ve renkli yiyecek,içeceklere dikkat edilmelidir. 
                                </div>
                            </div>
                        </div>

                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                               Ağız kokum var sebebi ne olabilir?
                            </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                               Ağız kokusunun en yaygın sebebi diştaşına bağlı oluşan dişeti iltihabıdır.Düzenli diş fırçalamamak ve diş çürükleri de ağız kokusu sebebidir. 
                                </div>
                            </div>
                        </div>

                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingThree">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                   Kanal tedavisi ne kadar sürer?
                                </button>
                            </h2>
                            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                               Kanal tedavisi çok büyük bir oranda 1 veya 2 seansta biter.Sadece dişte akut enfeksiyon varsa,ateş,halsizlik gibi sistemik belirtiler görünüyorsa kök kanallarının içine daha uzun süreler kalacak dezenfektan ilaçların konulması gerekebilir.Böyle durumlarda da 3-4 seanste biter. 
                                </div>
                            </div>
                        </div>

                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingFour">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                Diş çekiminden hemen sonra implant olur mu?
                                </button>
                            </h2>
                            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
Çekilen diş enfeksiyon yoksa, kemik yapısına bağlı olarak aynı seansta çekim yerine implant yerleştirilebilir.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Faq;