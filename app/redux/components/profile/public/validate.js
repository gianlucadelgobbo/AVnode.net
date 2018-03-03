import validatorsObj from '../../../../utilities/validators.js';

const validators = validatorsObj.validators;

const profilePublicValidate = values => {

    const errors = {};

    if (!values.stagename || values.stagename.trim() === "") {
        errors.stagename = 'Stage Name Required';
    }
    else if (!validators.validateStringLength(values.stagename, 2, 30)) {
        errors.stagename = 'Must be more or equal 2 and less or equal 30 characters';
    }
    if (!values.slug || values.slug.trim() === "") {
        errors.slug = 'Slug Required';
    }
    if (values.slug) {
        if (!validators.isSlug(values.slug)) {
            errors.slug = 'Characters Not Allowed';
        }
    }

    // if (!values.web || !values.web.length) {
    //     errors.web = {_error: 'At least one link must be entered'}
    // }
    // else {
    //     const webArrayErrors = [];
    //     values.web.forEach((w, windex) => {
    //         const webErrors = {};
    //         if (!w || !w.url) {
    //             webErrors.url = '';
    //         }
    //         else if (!validators.isUrl(w.url)) {
    //             webErrors.url = 'Invalid link, please insert a valid link ';
    //             webArrayErrors[windex] = webErrors;
    //         }
    //         if (values.web.length > 5) {
    //             if (!webErrors.web) {
    //                 webErrors.url = []
    //             }
    //             webErrors.url._error = 'No more than five link allowed'
    //             webArrayErrors[windex] = webErrors
    //         }
    //     });
    //
    //     if (webArrayErrors.length) {
    //         errors.web = webArrayErrors;
    //     }
    // }
    //
    // if (!values.social || !values.social.length) {
    //     errors.social = {_error: 'At least one link must be entered'}
    // }
    // else {
    //     const socialArrayErrors = [];
    //     values.social.forEach((s, sindex) => {
    //         const socialErrors = {};
    //         if (!s || !s.url) {
    //             socialErrors.url = '';
    //         }
    //         else if (!validators.isUrl(s.url)) {
    //             socialErrors.url = 'Invalid link, please insert a valid link ';
    //             socialArrayErrors[sindex] = socialErrors;
    //         }
    //     });
    //     if (socialArrayErrors.length) {
    //         errors.social = socialArrayErrors;
    //     }
    // }

    return errors;
};

export default profilePublicValidate;