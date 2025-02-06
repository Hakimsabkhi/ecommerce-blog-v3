export const dynamic = 'force-dynamic'; // Ensure the page is dynamically rendered

import Contactusbanner from '@/components/contactusbanner';
import Milanotorino from '@/components/milanotorino';
import { getWebsiteinfo } from '@/lib/StaticDataHomePage';
import React from 'react';



const Page = async () => {
  const company = await getWebsiteinfo();
  const companyData = JSON.parse(company);
  return (
    <div>
      <Contactusbanner companyData={companyData} />
      <Milanotorino />
    </div>
  );
};

export default Page;
