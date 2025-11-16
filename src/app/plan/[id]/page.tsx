'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plan } from '@/types';
import Button from '@/components/ui/Button';
import { Download, Mail, X } from 'lucide-react';

interface PlanPageProps {
  params: { id: string };
}

const PlanPage: React.FC<PlanPageProps> = ({ params }) => {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchPlan = useCallback(async () => {
    try {
      const response = await fetch(`/api/plans/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Plan not found');
      }

      const planData = await response.json();
      setPlan(planData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plan');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/plans/${params.id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `marketing-plan-${plan?.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const sendEmail = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setEmailSending(true);
    try {
      const response = await fetch(`/api/plans/${params.id}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setEmailSuccess(true);
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSuccess(false);
        setEmail('');
      }, 2000);
    } catch (err) {
      alert('Failed to send email. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your marketing plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!plan || !plan.generatedContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Still Generating</h1>
          <p className="text-gray-600 mb-6">Your marketing plan is still being generated. Please check back in a few minutes.</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  const { onePagePlan, implementationGuide, strategicInsights } = plan.generatedContent;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Marketing Plan</h1>
              <p className="text-gray-600">Generated on {new Date(plan.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowEmailModal(true)}
                className="cursor-pointer"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Plan
              </Button>
              <Button 
                onClick={downloadPDF} 
                loading={downloading}
                className="cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* One-Page Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">One-Page Marketing Plan</h2>
              
              {/* Before Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">BEFORE (Prospects)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Market</h4>
                    <p className="text-gray-700 text-sm">{onePagePlan.before.targetMarket}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                    <p className="text-gray-700 text-sm">{onePagePlan.before.message}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Media</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      {onePagePlan.before.media.map((channel, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {channel}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* During Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-green-600 mb-4">DURING (Leads)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Lead Capture</h4>
                    <p className="text-gray-700 text-sm">{onePagePlan.during.leadCapture}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Lead Nurture</h4>
                    <p className="text-gray-700 text-sm">{onePagePlan.during.leadNurture}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Sales Conversion</h4>
                    <p className="text-gray-700 text-sm">{onePagePlan.during.salesConversion}</p>
                  </div>
                </div>
              </div>

              {/* After Section */}
              <div>
                <h3 className="text-xl font-semibold text-purple-600 mb-4">AFTER (Customers)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Deliver Experience</h4>
                    <p className="text-gray-700 text-sm">{onePagePlan.after.deliverExperience}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Lifetime Value</h4>
                    <p className="text-gray-700 text-sm">{onePagePlan.after.lifetimeValue}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Referrals</h4>
                    <p className="text-gray-700 text-sm">{onePagePlan.after.referrals}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Implementation Guide */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Guide</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h3>
                <p className="text-gray-700">{implementationGuide.executiveSummary}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Phase 1 (First 30 Days)</h3>
                  <p className="text-gray-700">{implementationGuide.actionPlans.phase1}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Phase 2 (Days 31-90)</h3>
                  <p className="text-gray-700">{implementationGuide.actionPlans.phase2}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Phase 3 (Days 91-180)</h3>
                  <p className="text-gray-700">{implementationGuide.actionPlans.phase3}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Insights Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Insights</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {strategicInsights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Opportunities</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {strategicInsights.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Key Risks</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {strategicInsights.risks.map((risk, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-3">
                <Button className="w-full cursor-pointer" onClick={() => router.push('/questionnaire')}>
                  Create New Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Email Your Plan
              </h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {emailSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Email Sent Successfully!
                  </h3>
                  <p className="text-green-700">
                    Check your inbox for your marketing plan.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={emailSending}
                    />
                  </div>

                  <p className="text-sm text-gray-600">
                    We'll send your marketing plan PDF to this email address.
                  </p>

                  <Button
                    onClick={sendEmail}
                    loading={emailSending}
                    disabled={!email}
                    className="w-full cursor-pointer"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Plan
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanPage;