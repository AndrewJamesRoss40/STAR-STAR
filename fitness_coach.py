#!/usr/bin/env python3
"""
Fitness Coach using OpenAI Chat Completions
Simplified version for better performance
"""

import os
import json
import sys
from openai import OpenAI

def get_fitness_analysis(workout_data):
    """Get fitness analysis from OpenAI"""
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    prompt = f"""
You are an experienced sports and fitness doctor specializing in muscle growth and hypertrophy at the cellular and molecular level. 

CLIENT PROFILE:
- Age: 62 years old
- Height: 5'10"
- Current Weight: 172 lbs
- Goal: Lose 20 lbs while maximizing lean muscle mass
- Health Status: Excellent condition, fully committed
- Focus: Science-backed hypertrophy and strength protocols

CURRENT WORKOUT DATA:
{json.dumps(workout_data, indent=2)}

Please provide specific recommendations for:

1. **Training Frequency & Volume**: Based on current performance, what's the optimal training frequency for pull-ups at age 62?

2. **Progressive Overload**: How should the client progress to maximize hypertrophy while avoiding injury?

3. **Complementary Exercises**: What additional exercises should be incorporated to support pull-up strength and overall upper body development?

4. **Recovery Optimization**: Specific recovery protocols for a 62-year-old focusing on muscle protein synthesis and adaptation.

5. **Nutrition Timing**: Pre/post workout nutrition strategies to maximize training adaptations.

6. **Supplementation**: Evidence-based supplements that could enhance training results safely.

Provide specific, actionable recommendations with scientific rationale. Focus on age-appropriate modifications and safety considerations for mature athletes.
"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a world-class sports medicine doctor and hypertrophy specialist with 25+ years of experience working with athletes over 50. Provide evidence-based, actionable advice."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    
    return response.choices[0].message.content

def get_nutrition_advice(client_stats):
    """Get nutrition advice from OpenAI"""
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    prompt = f"""
You are an experienced sports nutritionist specializing in body recomposition for mature athletes.

CLIENT PROFILE:
{json.dumps(client_stats, indent=2)}

Please provide detailed nutrition guidance for:

1. **Caloric Targets**: Specific daily calorie and macronutrient recommendations for losing 20 lbs while maintaining/gaining muscle

2. **Protein Strategy**: Optimal protein intake, timing, and sources for muscle protein synthesis in a 62-year-old

3. **Carbohydrate Timing**: When and how much carbs to optimize training and recovery

4. **Fat Requirements**: Essential fatty acids and their role in hormone optimization for mature athletes

5. **Meal Timing**: Optimal meal frequency and timing for body recomposition

6. **Hydration**: Specific hydration strategies for performance and recovery

7. **Micronutrients**: Key vitamins and minerals for optimal health and performance at age 62

Provide specific numbers, timing, and evidence-based recommendations with scientific rationale. Focus on sustainable, long-term strategies.
"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a world-class sports nutritionist specializing in body recomposition for athletes over 50. Provide specific, evidence-based recommendations."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    
    return response.choices[0].message.content

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fitness_coach.py <function> [data]")
        sys.exit(1)
    
    function_name = sys.argv[1]
    data = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
    
    try:
        if function_name == "analyze":
            result = get_fitness_analysis(data)
            print(result)
        elif function_name == "nutrition":
            result = get_nutrition_advice(data)
            print(result)
        else:
            print(f"Unknown function: {function_name}")
            sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)