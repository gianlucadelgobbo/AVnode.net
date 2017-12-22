
const OrgTypes = [
  {'name':'Art gallery','val':'art_gallery'},
  {'name':'Centre for Architecture','val':'centre_for_architecture'},
  {'name':'Choir','val':'choir'},
  {'name':'Concert hall','val':'concert_hall'},
  {'name':'Dance Company','val':'dance_company'},
  {'name':'Design/Art centre','val':'design-art_centre'},
  {'name':'Festival (non Audiovisual)','val':'festival'},
  {'name':'Group of young people active in youth work','val':'group_of_young_people_active_in_youth_work'},
  {'name':'Higher education institution (tertiary level)','val':'higher_education_institution'},
  {'name':'Library','val':'library'},
  {'name':'Literature Foundation','val':'literature_foundation'},
  {'name':'Local Public body','val':'local_public_body'},
  {'name':'Multimedia association','val':'multimedia_association'},
  {'name':'Museum','val':'museum'},
  {'name':'Music Centre','val':'music_centre'},
  {'name':'National Public body','val':'national_public_body'},
  {'name':'Non-governmental organisation/association/social enterprise','val':'non-governmental_organisation-association-social_enterprise'},
  {'name':'Opera','val':'opera'},
  {'name':'Orchestra','val':'orchestra'},
  {'name':'Regional Public body','val':'regional_public_body'},
  {'name':'Research Institute/Centre','val':'research_institute-centre'},
  {'name':'School/Institute/Educational centre – General education (secondary level)','val':'school-institute-educational_centre-general_education'},
  {'name':'Street art association','val':'street_art_association'},
  {'name':'Theatre','val':'theatre'},
  {'name':'Other','val':'other'}
];

export default OrgTypes;
/*
BL FIXME do multilang
<Field
                                className="form-control custom-select"
                                name="org_type"
                                component="select"
                            >
                                <option value="">
                                    <FormattedMessage
                                        id="Please select"
                                        defaultMessage="Please select"
                                    />
                                </option>
                                <option value="art_gallery">
                                    <FormattedMessage
                                        id="art_gallery"
                                        defaultMessage="Art gallery"
                                    />
                                </option>
                                <option value="centre_for_architecture">
                                    <FormattedMessage
                                        id="centre_for_architecture"
                                        defaultMessage="Centre for Architecture"
                                    />
                                </option>
                                <option value="choir">
                                    <FormattedMessage
                                        id="choir"
                                        defaultMessage="Choir"
                                    />
                                </option>
                                <option value="concert_hall">
                                    <FormattedMessage
                                        id="concert_hall"
                                        defaultMessage="Concert hall"
                                    />
                                </option>
                                <option value="dance_company">
                                    <FormattedMessage
                                        id="dance_company"
                                        defaultMessage="Dance Company"
                                    />
                                </option>
                                <option value="design-art_centre">
                                    <FormattedMessage
                                        id="design-art_centre"
                                        defaultMessage="Design/Art centre"
                                    />
                                </option>
                                <option value="festival">
                                    <FormattedMessage
                                        id="festival"
                                        defaultMessage="Festival (non Audiovisual)"
                                    />
                                </option>
                                <option value="group_of_young_people_active_in_youth_work">
                                    <FormattedMessage
                                        id="group_of_young_people_active_in_youth_work"
                                        defaultMessage="Group of young people active in youth work"
                                    />
                                </option>
                                <option value="higher_education_institution">
                                    <FormattedMessage
                                        id="higher_education_institution"
                                        defaultMessage="Higher education institution (tertiary level)"
                                    />
                                </option>
                                <option value="library">
                                    <FormattedMessage
                                        id="library"
                                        defaultMessage="Library"
                                    />
                                </option>
                                <option value="literature_foundation">
                                    <FormattedMessage
                                        id="literature_foundation"
                                        defaultMessage="Literature Foundation"
                                    />
                                </option>
                                <option value="local_public_body">
                                    <FormattedMessage
                                        id="local_public_body"
                                        defaultMessage="Local Public body"
                                    />
                                </option>
                                <option value="multimedia_association">
                                    <FormattedMessage
                                        id="multimedia_association"
                                        defaultMessage="Multimedia association"
                                    />
                                </option>
                                <option value="museum">
                                    <FormattedMessage
                                        id="museum"
                                        defaultMessage="Museum"
                                    />
                                </option>
                                <option value="music_centre">
                                    <FormattedMessage
                                        id="music_centre"
                                        defaultMessage="Music Centre"
                                    />
                                </option>
                                <option value="national_public_body">
                                    <FormattedMessage
                                        id="national_public_body"
                                        defaultMessage="National Public body"
                                    />
                                </option>
                                <option value="non-governmental_organisation-association-social_enterprise">
                                    <FormattedMessage
                                        id="non-governmental_organisation-association-social_enterprise"
                                        defaultMessage="Non-governmental organisation/association/social enterprise"
                                    />
                                </option>
                                <option value="opera">
                                    <FormattedMessage
                                        id="opera"
                                        defaultMessage="Opera"
                                    />
                                </option>
                                <option value="orchestra">
                                    <FormattedMessage
                                        id="orchestra"
                                        defaultMessage="Orchestra"
                                    />
                                </option>
                                <option value="regional_public_body">
                                    <FormattedMessage
                                        id="regional_public_body"
                                        defaultMessage="Regional Public body"
                                    />
                                </option>
                                <option value="research_institute-centre">
                                    <FormattedMessage
                                        id="research_institute-centre"
                                        defaultMessage="Research Institute/Centre"
                                    />
                                </option>
                                <option value="school-institute-educational_centre-general_education">
                                    <FormattedMessage
                                        id="school-institute-educational_centre-general_education"
                                        defaultMessage="School/Institute/Educational centre – General education (secondary level)"
                                    />
                                </option>
                                <option value="street_art_association">
                                    <FormattedMessage
                                        id="street_art_association"
                                        defaultMessage="Street art association"
                                    />
                                </option>
                                <option value="theatre">
                                    <FormattedMessage
                                        id="theatre"
                                        defaultMessage="Theatre"
                                    />
                                </option>
                                <option value="other">
                                    <FormattedMessage
                                        id="other"
                                        defaultMessage="Other"
                                    />
                                </option>
                            </Field>
*/