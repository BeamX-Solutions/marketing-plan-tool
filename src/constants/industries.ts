import { Industry } from '@/types';

export const INDUSTRIES: Industry[] = [
  {
    id: 'professional-services',
    name: 'Professional Services',
    description: 'Consulting, legal, accounting, and other professional services',
    commonChallenges: ['Trust building', 'Thought leadership', 'Referral generation', 'Service differentiation'],
    keyMetrics: ['Client lifetime value', 'Referral rate', 'Case completion rate', 'Hourly utilization'],
    marketingChannels: ['LinkedIn', 'Content marketing', 'Referrals', 'Industry events', 'SEO']
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    description: 'Medical practices, healthcare services, and wellness businesses',
    commonChallenges: ['Compliance regulations', 'Patient trust', 'Insurance complexities', 'Online reputation'],
    keyMetrics: ['Patient retention', 'Appointment fill rate', 'Patient satisfaction', 'Treatment outcomes'],
    marketingChannels: ['Google Ads', 'Local SEO', 'Patient reviews', 'Referral networks', 'Health content']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Retail',
    description: 'Online stores, retail businesses, and product-based companies',
    commonChallenges: ['Cart abandonment', 'Customer acquisition cost', 'Inventory management', 'Competition'],
    keyMetrics: ['Conversion rate', 'Average order value', 'Customer lifetime value', 'Return on ad spend'],
    marketingChannels: ['Facebook Ads', 'Google Shopping', 'Email marketing', 'Social media', 'Influencer marketing']
  },
  {
    id: 'restaurants',
    name: 'Restaurants & Food Service',
    description: 'Restaurants, cafes, catering, and food service businesses',
    commonChallenges: ['Seasonal fluctuations', 'Local competition', 'Online reviews', 'Staff turnover'],
    keyMetrics: ['Average ticket size', 'Table turnover', 'Customer frequency', 'Online review rating'],
    marketingChannels: ['Google My Business', 'Social media', 'Local SEO', 'Food delivery apps', 'Events']
  },
  {
    id: 'b2b-software',
    name: 'B2B Software & SaaS',
    description: 'Software companies, SaaS platforms, and tech services',
    commonChallenges: ['Long sales cycles', 'Product complexity', 'Churn reduction', 'Market education'],
    keyMetrics: ['Monthly recurring revenue', 'Churn rate', 'Customer acquisition cost', 'Product adoption'],
    marketingChannels: ['Content marketing', 'LinkedIn', 'Webinars', 'SEO', 'Account-based marketing']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Real estate agents, brokers, and property management companies',
    commonChallenges: ['Market cycles', 'Lead quality', 'Trust building', 'Transaction timelines'],
    keyMetrics: ['Listings conversion', 'Average commission', 'Client satisfaction', 'Referral rate'],
    marketingChannels: ['Local SEO', 'Social media', 'Real estate portals', 'Referrals', 'Direct mail']
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    description: 'Gyms, personal trainers, wellness coaches, and fitness services',
    commonChallenges: ['Member retention', 'Seasonal demand', 'Competition', 'Motivation maintenance'],
    keyMetrics: ['Member lifetime value', 'Attendance rate', 'Class utilization', 'Member satisfaction'],
    marketingChannels: ['Instagram', 'Facebook', 'Google Ads', 'Local partnerships', 'Community events']
  },
  {
    id: 'home-services',
    name: 'Home Services',
    description: 'Contractors, cleaners, landscapers, and home improvement services',
    commonChallenges: ['Seasonality', 'Trust verification', 'Scheduling efficiency', 'Repeat business'],
    keyMetrics: ['Job completion rate', 'Customer satisfaction', 'Repeat customer rate', 'Average job value'],
    marketingChannels: ['Google Ads', 'Local SEO', 'Home service apps', 'Referrals', 'Neighborhood apps']
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Manufacturers, suppliers, and industrial businesses',
    commonChallenges: ['Supply chain complexity', 'B2B relationships', 'Quality assurance', 'Regulatory compliance'],
    keyMetrics: ['Order fulfillment rate', 'Quality metrics', 'Customer retention', 'Production efficiency'],
    marketingChannels: ['Trade shows', 'LinkedIn', 'Industry publications', 'Direct sales', 'B2B directories']
  },
  {
    id: 'education',
    name: 'Education & Training',
    description: 'Schools, training programs, online courses, and educational services',
    commonChallenges: ['Student engagement', 'Course completion', 'Credibility building', 'Outcome measurement'],
    keyMetrics: ['Enrollment rate', 'Completion rate', 'Student satisfaction', 'Job placement rate'],
    marketingChannels: ['Content marketing', 'Social media', 'Educational platforms', 'Webinars', 'Partnerships']
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    description: 'Banks, insurance, financial planning, and investment services',
    commonChallenges: ['Regulatory compliance', 'Trust building', 'Complex products', 'Risk communication'],
    keyMetrics: ['Assets under management', 'Client retention', 'Policy renewals', 'Cross-sell rate'],
    marketingChannels: ['Content marketing', 'Referrals', 'LinkedIn', 'Educational seminars', 'Email marketing']
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit & Charity',
    description: 'Charitable organizations, foundations, and social impact organizations',
    commonChallenges: ['Donor retention', 'Impact measurement', 'Volunteer engagement', 'Funding sustainability'],
    keyMetrics: ['Donation conversion', 'Donor lifetime value', 'Volunteer hours', 'Program effectiveness'],
    marketingChannels: ['Social media', 'Email marketing', 'Grant applications', 'Community events', 'Peer-to-peer']
  }
];

export const getIndustryById = (id: string): Industry | undefined => {
  return INDUSTRIES.find(industry => industry.id === id);
};

export const getIndustriesByCategory = (category: string): Industry[] => {
  const categories: Record<string, string[]> = {
    'service': ['professional-services', 'healthcare', 'home-services', 'fitness', 'education', 'financial-services'],
    'product': ['ecommerce', 'manufacturing', 'restaurants'],
    'technology': ['b2b-software', 'ecommerce'],
    'local': ['restaurants', 'real-estate', 'fitness', 'home-services', 'healthcare'],
    'b2b': ['professional-services', 'b2b-software', 'manufacturing', 'financial-services'],
    'b2c': ['ecommerce', 'restaurants', 'fitness', 'home-services', 'healthcare', 'real-estate']
  };
  
  const industryIds = categories[category] || [];
  return INDUSTRIES.filter(industry => industryIds.includes(industry.id));
};