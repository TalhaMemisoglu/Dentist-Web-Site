import React from 'react';
import './ContactForm.scss';
import icon from '../../assets/banner/icons/Calling.png';

const ContactForm = () => {
    return (
        <form>
            <div className="row">
                <div className="col-lg-6">
                    <div class="form-group">
                        <label>Ad</label>
                        <input type="email" class="form-control" placeholder="İsminizi giriniz..." />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div class="form-group">
                        <label>MAİL ADRESİ</label>
                        <input type="email" class="form-control" placeholder="Mail adresinizi giriniz..." />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div class="form-group">
                        <label>HİZMET</label>
                        <select class="form-control">
                            <option>Diş beyazlatma</option>
                            <option>İmplant</option>
                            <option>Diş protezi</option>
                            <option>Kanal tedavi</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div class="form-group">
                        <label>Department</label>
                        <select class="form-control">
                            <option>Select Department</option>
                            <option>Select Department</option>
                            <option>Select Department</option>
                            <option>Select Department</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">Mesajlar</label>
                        <textarea class="form-control" placeholder='Mesajınızı giriniz...' rows="3"></textarea>
                    </div>
                </div>

                <div className="col-lg-6">
                    <button type="submit" class="btn appointment-btn">Randevu Al</button>
                </div>
                <div className="col-lg-6">
                    <div className="appointment-call">
                        <div className='icon'>
                            <img src={icon} alt="icon" />
                        </div>
                        <div className='call-text'>
                            <p>24 SAAT ACİL DESTEK</p>
                            <h6>03 482 394 123</h6>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ContactForm;