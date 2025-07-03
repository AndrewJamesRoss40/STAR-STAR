#!/usr/bin/env python3
"""
Simple OpenAI Assistant for Fitness Coaching
"""

import os
import json
import time
from openai import OpenAI

def get_fitness_analysis(workout_data):
    """Get fitness analysis from OpenAI Assistant"""
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    # Create assistant
    assistant = client.beta.assistants.create(
        name="Dr. Hypertrophy Specialist",
        instructions="""
Act as an experienced sports and fitness doctor or specialist in muscle growth and hypertrophy at the cellular and molecular level. Provide continual, detailed, cutting-edge advice and suggestions on nutrition, exercise, supplementation, recovery, injury prevention, and any science-backed interventions to maximize hypertrophy, strength, and long-term health. 

The client is a 62-year-old male (currently 172 pounds, 5'10", about 20 pounds over best weight achieved 12 months ago) in good health and excellent condition, 100% committed to following any program or protocol recommended. 

Offer evidence-based guidance with references, using the latest science-backed research, to help him gain maximum lean muscle mass safely and sustainably.

Key Client Profile:
- Age: 62 years old
- Height: 5'10"
- Current Weight: 172 lbs
- Goal: Lose 20 lbs while maximizing lean muscle mass
- Health Status: Excellent condition, fully committed
- Focus: Science-backed hypertrophy and strength protocols

Always provide:
1. Specific, actionable recommendations
2. Scientific references when possible
3. Age-appropriate modifications for a 62-year-old
4. Safety considerations for mature athletes
5. Progressive overload principles
6. Recovery optimization strategies
""",
        model="gpt-4o",
        tools=[{"type": "code_interpreter"}]
    )
    
    # Create thread
    thread = client.beta.threads.create()
    
    # Prepare message
    message = f"""
Please analyze my current pull-up training progress and provide specific recommendations for:

1. **Training Frequency & Volume**: Based on my current performance, what's the optimal training frequency for pull-ups at age 62?

2. **Progressive Overload**: How should I progress to maximize hypertrophy while avoiding injury?

3. **Complementary Exercises**: What additional exercises should I incorporate to support pull-up strength and overall upper body development?

4. **Recovery Optimization**: Specific recovery protocols for a 62-year-old focusing on muscle protein synthesis and adaptation.

5. **Nutrition Timing**: Pre/post workout nutrition strategies to maximize training adaptations.

6. **Supplementation**: Evidence-based supplements that could enhance my training results safely.

Please provide specific, actionable recommendations with scientific rationale.

Current Workout Data:
{json.dumps(workout_data, indent=2)}
"""
    
    # Send message
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=message
    )
    
    # Run assistant
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant.id
    )
    
    # Wait for completion
    while run.status in ['queued', 'in_progress', 'cancelling']:
        time.sleep(1)
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
    
    if run.status == 'completed':
        # Get response
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        for msg in messages.data:
            if msg.role == 'assistant':
                return msg.content[0].text.value
    
    return f"Assistant run failed with status: {run.status}"

def get_nutrition_advice(client_stats):
    """Get nutrition advice from OpenAI Assistant"""
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    # Create assistant
    assistant = client.beta.assistants.create(
        name="Nutrition Specialist",
        instructions="""
Act as an experienced sports and fitness doctor or specialist in muscle growth and hypertrophy at the cellular and molecular level. Provide continual, detailed, cutting-edge advice and suggestions on nutrition, exercise, supplementation, recovery, injury prevention, and any science-backed interventions to maximize hypertrophy, strength, and long-term health. 

The client is a 62-year-old male (currently 172 pounds, 5'10", about 20 pounds over best weight achieved 12 months ago) in good health and excellent condition, 100% committed to following any program or protocol recommended. 

Focus on nutrition strategies for body recomposition - losing fat while gaining muscle mass.
""",
        model="gpt-4o"
    )
    
    # Create thread
    thread = client.beta.threads.create()
    
    # Prepare message
    message = f"""
Based on my current stats, please provide:

1. **Caloric Targets**: Specific daily calorie and macronutrient recommendations
2. **Protein Strategy**: Optimal protein intake, timing, and sources for muscle protein synthesis
3. **Carbohydrate Timing**: When and how much carbs to optimize training and recovery
4. **Fat Requirements**: Essential fatty acids and their role in hormone optimization
5. **Meal Timing**: Optimal meal frequency and timing for body recomposition
6. **Hydration**: Specific hydration strategies for performance and recovery

Please provide evidence-based recommendations with scientific references where possible.

Client Stats:
{json.dumps(client_stats, indent=2)}
"""
    
    # Send message
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=message
    )
    
    # Run assistant
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant.id
    )
    
    # Wait for completion
    while run.status in ['queued', 'in_progress', 'cancelling']:
        time.sleep(1)
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
    
    if run.status == 'completed':
        # Get response
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        for msg in messages.data:
            if msg.role == 'assistant':
                return msg.content[0].text.value
    
    return f"Assistant run failed with status: {run.status}"

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python simple_fitness_assistant.py <function> [data]")
        sys.exit(1)
    
    function_name = sys.argv[1]
    data = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
    
    if function_name == "analyze":
        result = get_fitness_analysis(data)
        print(result)
    elif function_name == "nutrition":
        result = get_nutrition_advice(data)
        print(result)
    else:
        print(f"Unknown function: {function_name}")
        sys.exit(1)