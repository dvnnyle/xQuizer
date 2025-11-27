import json
import random

# Read the uxQuiz2Data.json file
with open('dataBank/dataSub/uxQuiz2Data.json', 'r', encoding='utf-8-sig') as f:
    questions = json.load(f)

# Shuffle options for each question
for question in questions:
    options = question['options']
    answer_index = question['answerIndex']
    correct_answer = options[answer_index]
    
    # Create list of (option, is_correct) tuples
    options_with_flag = [(opt, opt == correct_answer) for opt in options]
    
    # Shuffle
    random.shuffle(options_with_flag)
    
    # Update question
    question['options'] = [opt for opt, _ in options_with_flag]
    question['answerIndex'] = next(i for i, (_, is_correct) in enumerate(options_with_flag) if is_correct)

# Write back
with open('dataBank/dataSub/uxQuiz2Data.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print("Randomized answer positions in uxQuiz2Data.json")
print(f"Answer indices: {[q['answerIndex'] for q in questions]}")
