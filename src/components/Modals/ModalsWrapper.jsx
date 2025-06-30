"use client";
import React from 'react';
import { useSnapshot } from 'valtio';
import { lightboxActions, lightboxState } from '@/store/lightboxStore';
import { BasicLightBox } from './BasicLightBox';
import { ContactFormLightbox } from '../Contact/ContactFormLightbox';
import { AddToCartLightBox } from '../AddToCart/AddToCartLightBox';
import { LoginModal } from './LoginModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { MatchFeatureLightBox } from '../Account/MatchFeature/MatchFeatureLightBox';
import { InvalidateLightBox } from '../Invalidate/InvalidateLightBox';

export const ModalsWrapper = ({ data }) => {
    const { lightboxes, basicLightBoxDetails, addToCartModal, matchProductsLightBoxDetails } = useSnapshot(lightboxState);
    const { contact, login, forgotPassword, invalidate } = lightboxes;
    const { branches, contactFormData, loginPageDetails } = data;

    return (
        <>
            <BasicLightBox data={basicLightBoxDetails} onClose={() => lightboxActions.resetBasicLightBoxDetails()} />
            <MatchFeatureLightBox data={matchProductsLightBoxDetails} onClose={() => lightboxActions.resetMatchProductsLightBoxDetails()} />
            <AddToCartLightBox data={addToCartModal} onClose={() => lightboxActions.resetAddToCartModal()} />
            <ContactFormLightbox locationsData={branches} data={contactFormData} isOpen={contact} onClose={() => lightboxActions.hideLightBox("contact")} />
            <LoginModal data={loginPageDetails} isOpen={login} onClose={() => lightboxActions.hideLightBox("login")} />
            <ForgotPasswordModal isOpen={forgotPassword} onClose={() => lightboxActions.hideLightBox("forgotPassword")} />
            <InvalidateLightBox isOpen={invalidate} onClose={() => lightboxActions.hideLightBox("invalidate")}/>
        </>
    )
}
