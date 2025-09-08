import Anthropic from '@anthropic-ai/sdk';
import { BusinessContext, QuestionnaireResponses, ClaudeAnalysis, GeneratedContent } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const ANALYSIS_PROMPT = `
You are an expert marketing strategist analyzing a business for comprehensive strategic planning. 
Review the following business information and questionnaire responses, then provide a thorough analysis.

Business Context: {business_context}
Questionnaire Responses: {responses}

Provide a comprehensive analysis in JSON format including:
1. businessModelAssessment: Evaluation of the business model strengths and weaknesses
2. marketOpportunity: Analysis of market size, trends, and opportunities
3. competitivePositioning: Assessment of competitive landscape and positioning
4. customerAvatarRefinement: Detailed ideal customer profile based on responses
5. strategicRecommendations: Array of specific, actionable strategic recommendations
6. riskFactors: Array of potential challenges and risks to consider
7. growthPotential: Assessment of growth opportunities and scalability

Structure your analysis professionally with clear insights and actionable observations.
Return only valid JSON without any markdown formatting or additional text.
`;

const STRATEGY_PROMPT = `
Based on the business analysis provided, develop a comprehensive marketing strategy that follows the 9-square marketing plan framework.

Business Analysis: {analysis}
Business Context: {business_context}
Questionnaire Responses: {responses}

Generate a complete marketing plan in JSON format with the following structure:

{
  "onePagePlan": {
    "before": {
      "targetMarket": "Detailed description of ideal customer avatar",
      "message": "Clear, compelling unique value proposition",
      "media": ["Top 3 marketing channels with specific rationale"]
    },
    "during": {
      "leadCapture": "Specific lead capture mechanism and compelling offer",
      "leadNurture": "Strategic nurturing sequence and content strategy",
      "salesConversion": "Optimized sales process and key conversion tactics"
    },
    "after": {
      "deliverExperience": "Customer delivery and onboarding strategy",
      "lifetimeValue": "Retention and customer growth strategies",
      "referrals": "Systematic referral generation system"
    }
  },
  "implementationGuide": {
    "executiveSummary": "2-3 paragraph overview of the strategy and expected outcomes",
    "actionPlans": {
      "phase1": "First 30 days action items with specific tasks",
      "phase2": "Days 31-90 action items and initiatives",
      "phase3": "Days 91-180 scaling and optimization activities"
    },
    "timeline": "Detailed implementation timeline with milestones",
    "resources": "Required resources, tools, and budget estimates",
    "kpis": "Key performance indicators and success metrics to track",
    "templates": "Specific templates, scripts, and tools needed"
  },
  "strategicInsights": {
    "strengths": ["Key business strengths to leverage"],
    "opportunities": ["Market opportunities to pursue"],
    "positioning": "Recommended market positioning strategy",
    "competitiveAdvantage": "Unique competitive advantages to emphasize",
    "growthPotential": "Assessment of growth potential and scalability",
    "risks": ["Key risks and mitigation strategies"],
    "investments": ["Recommended marketing investments and priorities"],
    "roi": "Expected return on investment and key metrics"
  }
}

Ensure all recommendations are:
- Industry-specific and relevant
- Actionable with clear next steps
- Budget-conscious based on stated constraints
- Measurable with specific KPIs
- Realistic for the business size and maturity

Return only valid JSON without any markdown formatting or additional text.
`;

export class ClaudeService {
  async analyzeBusinessResponses(
    businessContext: BusinessContext,
    responses: QuestionnaireResponses
  ): Promise<ClaudeAnalysis> {
    try {
      const prompt = ANALYSIS_PROMPT
        .replace('{business_context}', JSON.stringify(businessContext, null, 2))
        .replace('{responses}', JSON.stringify(responses, null, 2));

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format from Claude API');
      }

      const analysis = JSON.parse(content.text);
      return analysis;
    } catch (error) {
      console.error('Error analyzing business responses:', error);
      throw new Error('Failed to analyze business responses');
    }
  }

  async generateMarketingPlan(
    businessContext: BusinessContext,
    responses: QuestionnaireResponses,
    analysis: ClaudeAnalysis
  ): Promise<GeneratedContent> {
    try {
      const prompt = STRATEGY_PROMPT
        .replace('{analysis}', JSON.stringify(analysis, null, 2))
        .replace('{business_context}', JSON.stringify(businessContext, null, 2))
        .replace('{responses}', JSON.stringify(responses, null, 2));

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 6000,
        temperature: 0.2,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format from Claude API');
      }

      const generatedContent = JSON.parse(content.text);
      return generatedContent;
    } catch (error) {
      console.error('Error generating marketing plan:', error);
      throw new Error('Failed to generate marketing plan');
    }
  }

  async generateSquareSpecificContent(
    square: number,
    businessContext: BusinessContext,
    responses: QuestionnaireResponses,
    existingAnalysis?: ClaudeAnalysis
  ): Promise<Record<string, unknown>> {
    try {
      const squarePrompts: Record<number, string> = {
        1: 'Generate detailed target market analysis and customer avatar for marketing square 1',
        2: 'Generate comprehensive value proposition and messaging strategy for marketing square 2',
        3: 'Generate media channel strategy and reach optimization for marketing square 3',
        4: 'Generate lead capture mechanisms and acquisition strategy for marketing square 4',
        5: 'Generate lead nurturing and relationship building strategy for marketing square 5',
        6: 'Generate sales conversion and closing optimization for marketing square 6',
        7: 'Generate customer experience and delivery optimization for marketing square 7',
        8: 'Generate lifetime value and growth strategy for marketing square 8',
        9: 'Generate referral system and advocacy strategy for marketing square 9'
      };

      const prompt = `
        ${squarePrompts[square]}
        
        Business Context: ${JSON.stringify(businessContext, null, 2)}
        Relevant Responses: ${JSON.stringify(responses, null, 2)}
        ${existingAnalysis ? `Previous Analysis: ${JSON.stringify(existingAnalysis, null, 2)}` : ''}
        
        Provide specific, actionable recommendations for this marketing square in JSON format.
        Include implementation steps, success metrics, and industry-specific best practices.
        Return only valid JSON without any markdown formatting or additional text.
      `;

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3000,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format from Claude API');
      }

      return JSON.parse(content.text);
    } catch (error) {
      console.error(`Error generating square ${square} content:`, error);
      throw new Error(`Failed to generate square ${square} content`);
    }
  }

  async validateAndRefineResponses(
    responses: Partial<QuestionnaireResponses>
  ): Promise<{ suggestions: string[]; completionScore: number }> {
    try {
      const prompt = `
        Review these marketing questionnaire responses and provide feedback:
        
        ${JSON.stringify(responses, null, 2)}
        
        Analyze the responses and provide:
        1. suggestions: Array of specific suggestions for improving or clarifying responses
        2. completionScore: Numerical score from 0-100 indicating response quality and completeness
        
        Focus on:
        - Completeness of responses
        - Specificity and actionability
        - Clarity of business objectives
        - Market understanding depth
        
        Return only valid JSON without any markdown formatting or additional text.
      `;

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format from Claude API');
      }

      return JSON.parse(content.text);
    } catch (error) {
      console.error('Error validating responses:', error);
      return { suggestions: [], completionScore: 0 };
    }
  }
}

export const claudeService = new ClaudeService();