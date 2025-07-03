#!/usr/bin/env python3
"""
OpenAI Assistant for Fitness Coaching
Specialized in muscle growth and hypertrophy for a 62-year-old male client
"""

import os
import json
import time
from typing import Dict, Any, Optional
from openai import OpenAI

class FitnessAssistant:
    def __init__(self):
        # Initialize OpenAI client
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Assistant configuration
        self.assistant_name = "Dr. Hypertrophy Specialist"
        self.assistant_instructions = """
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
"""
        
        self.assistant_id = None
        self.thread_id = None
        
    def create_or_get_assistant(self) -> Optional[str]:
        """Create a new assistant or get existing one"""
        try:
            # Create new assistant
            assistant = self.client.beta.assistants.create(
                name=self.assistant_name,
                instructions=self.assistant_instructions,
                model="gpt-4o",  # Latest model for best performance
                tools=[{"type": "code_interpreter"}]  # Allow data analysis
            )
            self.assistant_id = assistant.id
            print(f"Created assistant: {self.assistant_id}")
            return self.assistant_id
            
        except Exception as e:
            print(f"Error creating assistant: {e}")
            return None
    
    def create_thread(self) -> Optional[str]:
        """Create a new conversation thread"""
        try:
            thread = self.client.beta.threads.create()
            self.thread_id = thread.id
            print(f"Created thread: {self.thread_id}")
            return self.thread_id
            
        except Exception as e:
            print(f"Error creating thread: {e}")
            return None
    
    def send_message(self, message: str, workout_data: Optional[Dict] = None) -> str:
        """Send message to the assistant and get response"""
        try:
            # Check if assistant and thread are initialized
            if not self.assistant_id or not self.thread_id:
                return "Assistant not properly initialized"
                
            # Prepare the message with workout data if provided
            full_message = message
            if workout_data:
                full_message += f"\n\nCurrent Workout Data:\n{json.dumps(workout_data, indent=2)}"
            
            # Add message to thread
            self.client.beta.threads.messages.create(
                thread_id=self.thread_id,
                role="user",
                content=full_message
            )
            
            # Run the assistant
            run = self.client.beta.threads.runs.create(
                thread_id=self.thread_id,
                assistant_id=self.assistant_id
            )
            
            # Wait for completion
            while run.status in ['queued', 'in_progress', 'cancelling']:
                time.sleep(1)
                run = self.client.beta.threads.runs.retrieve(
                    thread_id=self.thread_id,
                    run_id=run.id
                )
            
            if run.status == 'completed':
                # Get the assistant's response
                messages = self.client.beta.threads.messages.list(
                    thread_id=self.thread_id
                )
                
                # Return the latest assistant message
                for msg in messages.data:
                    if msg.role == 'assistant':
                        return msg.content[0].text.value
                        
            return f"Assistant run failed with status: {run.status}"
                
        except Exception as e:
            return f"Error sending message: {e}"
    
    def analyze_workout_progress(self, workout_data: Dict) -> str:
        """Analyze workout data and provide coaching feedback"""
        message = """
Please analyze my current pull-up training progress and provide specific recommendations for:

1. **Training Frequency & Volume**: Based on my current performance, what's the optimal training frequency for pull-ups at age 62?

2. **Progressive Overload**: How should I progress to maximize hypertrophy while avoiding injury?

3. **Complementary Exercises**: What additional exercises should I incorporate to support pull-up strength and overall upper body development?

4. **Recovery Optimization**: Specific recovery protocols for a 62-year-old focusing on muscle protein synthesis and adaptation.

5. **Nutrition Timing**: Pre/post workout nutrition strategies to maximize training adaptations.

6. **Supplementation**: Evidence-based supplements that could enhance my training results safely.

Please provide specific, actionable recommendations with scientific rationale.
"""
        
        return self.send_message(message, workout_data)
    
    def get_nutrition_advice(self, current_stats: Dict) -> str:
        """Get nutrition advice for muscle gain and fat loss"""
        message = f"""
Based on my current stats (172 lbs, 5'10", goal to lose 20 lbs while maximizing lean muscle), please provide:

1. **Caloric Targets**: Specific daily calorie and macronutrient recommendations
2. **Protein Strategy**: Optimal protein intake, timing, and sources for muscle protein synthesis
3. **Carbohydrate Timing**: When and how much carbs to optimize training and recovery
4. **Fat Requirements**: Essential fatty acids and their role in hormone optimization
5. **Meal Timing**: Optimal meal frequency and timing for body recomposition
6. **Hydration**: Specific hydration strategies for performance and recovery

Please provide evidence-based recommendations with scientific references where possible.
"""
        
        return self.send_message(message, current_stats)

def main():
    """Main function for testing the assistant"""
    # Initialize assistant
    assistant = FitnessAssistant()
    
    # Create assistant and thread
    assistant.create_or_get_assistant()
    assistant.create_thread()
    
    # Test with sample workout data
    sample_workout_data = {
        "date": "2025-07-03",
        "total_reps": 4,
        "sessions": [
            {"time": "04:36 PM", "reps": 1},
            {"time": "04:34 PM", "reps": 1},
            {"time": "04:34 PM", "reps": 1},
            {"time": "04:34 PM", "reps": 1}
        ],
        "personal_record": 4,
        "weekly_total": 4
    }
    
    # Get analysis
    print("Getting workout analysis...")
    response = assistant.analyze_workout_progress(sample_workout_data)
    print("\n" + "="*50)
    print("ASSISTANT RESPONSE:")
    print("="*50)
    print(response)
    
    return assistant

if __name__ == "__main__":
    main()