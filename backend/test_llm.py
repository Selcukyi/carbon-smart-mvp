#!/usr/bin/env python3
"""
Test script for LLM functionality
"""
import asyncio
import os
from app.services.llm_service import llm_service

async def test_llm_service():
    """Test LLM service with sample data"""
    
    # Sample emissions data
    test_data = {
        "total_emissions": 2847,
        "scope1": 1247,
        "scope2": 1456,
        "scope3": 144,
        "eu_ets_allowances": 2600,
        "eu_ets_used": 2847,
        "eu_ets_price": 85.50
    }
    
    print("🤖 LLM Service Test")
    print("=" * 50)
    
    # Test 1: Emissions Analysis
    print("\n1. Testing Emissions Analysis...")
    try:
        analysis = await llm_service.analyze_emissions_data(test_data)
        print("✅ Analysis completed")
        print(f"   Executive Summary: {analysis.get('executive_summary', 'N/A')[:100]}...")
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
    
    # Test 2: Recommendations
    print("\n2. Testing Recommendations...")
    try:
        recommendations = await llm_service.generate_recommendations(test_data)
        print("✅ Recommendations completed")
        print(f"   Found {len(recommendations)} recommendations")
        if recommendations:
            print(f"   First recommendation: {recommendations[0].get('title', 'N/A')}")
    except Exception as e:
        print(f"❌ Recommendations failed: {e}")
    
    # Test 3: Risk Assessment
    print("\n3. Testing Risk Assessment...")
    try:
        risks = await llm_service.assess_risks(test_data)
        print("✅ Risk assessment completed")
        print(f"   Overall risk level: {risks.get('overall_risk_level', 'N/A')}")
        print(f"   Found {len(risks.get('risks', []))} risks")
    except Exception as e:
        print(f"❌ Risk assessment failed: {e}")
    
    print("\n" + "=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    # Check if OpenAI API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("⚠️  OPENAI_API_KEY environment variable not set")
        print("   LLM service will use fallback responses")
        print("   To test with real LLM, set your OpenAI API key:")
        print("   export OPENAI_API_KEY='your-api-key-here'")
        print()
    
    asyncio.run(test_llm_service())