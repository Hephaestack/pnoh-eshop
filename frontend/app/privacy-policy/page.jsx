"use client"
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  // Signal page ready for smooth loading animation
  useEffect(() => {
    window.dispatchEvent(new Event("page-ready"));
  }, []);
  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <motion.section 
        className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container px-4 mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            {t('privacy_policy_title')}
          </motion.h1>
          <motion.div 
            className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          ></motion.div>
          <motion.p 
            className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            {t('privacy_policy_intro')}
          </motion.p>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="py-16 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-invert">
              {/* Last Updated */}
              <div className="bg-[#23232a] p-6 rounded-lg mb-8 text-center">
                <p className="text-sm text-[#bfc1c6] font-light mb-0">
                  <strong>{t('privacy_last_update_label')}:</strong> {t('privacy_last_update_date')}
                </p>
              </div>

              {/* Introduction */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('privacy_intro_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('privacy_intro_company')}</p>
                  <p>{t('privacy_intro_description')}</p>
                </div>
              </div>

              {/* Section 1 */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('privacy_section1_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('privacy_section1_collect_when')}</p>
                  <ul className="space-y-2">
                    <li>{t('privacy_section1_collect_1')}</li>
                    <li>{t('privacy_section1_collect_2')}</li>
                    <li>{t('privacy_section1_collect_3')}</li>
                    <li>{t('privacy_section1_collect_4')}</li>
                  </ul>
                  <hr className="my-6 border-t border-[#bfc1c6]/30" />
                  <p>{t('privacy_section1_data_collected')}</p>
                  <ul className="space-y-2 ">
                    <li>{t('privacy_section1_data_1')}</li>
                    <li>{t('privacy_section1_data_2')}</li>
                    <li>{t('privacy_section1_data_3')}</li>
                    <li>{t('privacy_section1_data_4')}</li>
                    <li>{t('privacy_section1_data_5')}</li>
                  </ul>
                  <hr className="my-6 border-t border-[#bfc1c6]/30" />
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('privacy_section2_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('privacy_section2_usage')}</p>
                  <ul className="space-y-2 ">
                    <li>{t('privacy_section2_usage_1')}</li>
                    <li>{t('privacy_section2_usage_2')}</li>
                    <li>{t('privacy_section2_usage_3')}</li>
                    <li>{t('privacy_section2_usage_4')}</li>
                    <li>{t('privacy_section2_usage_5')}</li>
                    <li>{t('privacy_section2_usage_6')}</li>
                  </ul>
                  <hr className="my-6 border-t border-[#bfc1c6]/30" />
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('privacy_section3_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('privacy_section3_intro')}</p>
                  <ul className="space-y-2 ">
                    <li>{t('privacy_section3_1')}</li>
                    <li>{t('privacy_section3_2')}</li>
                    <li>{t('privacy_section3_3')}</li>
                  </ul>
                  <hr className="my-6 border-t border-[#bfc1c6]/30" />
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('privacy_section4_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('privacy_section4_intro')}</p>
                  <ul className="space-y-2">
                    <li>{t('privacy_section4_1')}</li>
                    <li>{t('privacy_section4_2')}</li>
                    <li>{t('privacy_section4_3')}</li>
                    <li>{t('privacy_section4_4')}</li>
                  </ul>
                  <hr className="my-6 border-t border-[#bfc1c6]/30" />
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('privacy_section5_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>{t('privacy_section5_intro')}</p>
                  <ul className="space-y-2 ">
                    <li><strong>{t('privacy_section5_right_access_title')}:</strong> {t('privacy_section5_right_access_desc')}</li>
                    <li><strong>{t('privacy_section5_right_rectify_title')}:</strong> {t('privacy_section5_right_rectify_desc')}</li>
                    <li><strong>{t('privacy_section5_right_delete_title')}:</strong> {t('privacy_section5_right_delete_desc')}</li>
                    <li><strong>{t('privacy_section5_right_portability_title')}:</strong> {t('privacy_section5_right_portability_desc')}</li>
                    <li><strong>{t('privacy_section5_right_object_title')}:</strong> {t('privacy_section5_right_object_desc')}</li>
                  </ul>
                  <hr className="my-6 border-t border-[#bfc1c6]/30" />
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('privacy_section6_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#bfc1c6] font-light leading-relaxed">
                  <p>
                    {t('privacy_section6_intro')}{" "}
                    <a href="/cookies-policy" className="text-black hover:underline">
                      {t('privacy_section6_link')}
                    </a>{" "}
                    {t('privacy_section6_after_link')}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-[#23232a] p-8 rounded-lg text-center">
                <h2 className="text-2xl font-light tracking-wide text-[#e5e7eb] mb-6">{t('privacy_contact_title')}</h2>
                <div className="w-12 h-px bg-[#bfc1c6] mb-6 mx-auto"></div>
                <div className="space-y-2 text-[#bfc1c6] font-light">
                  <p>{t('privacy_contact_intro')}</p>
                  <p>
                    <strong>{t('privacy_contact_email_label')}:</strong> {t('privacy_contact_email')}
                  </p>
                  <p>
                    <strong>{t('privacy_contact_address_label')}:</strong> {t('privacy_contact_address')}
                  </p>
                  <p>
                    <strong>{t('privacy_contact_vat_label')}:</strong> {t('privacy_contact_vat')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
