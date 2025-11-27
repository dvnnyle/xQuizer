import json
import random

# Read the uxDataQBank.json file
with open('dataBank/dataSub/uxDataQBank.json', 'r', encoding='utf-8-sig') as f:
    questions = json.load(f)

# Shuffle options for each question with constraint to avoid consecutive repeats
previous_index = -1
for question in questions:
    options = question['options']
    answer_index = question['answerIndex']
    correct_answer = options[answer_index]
    
    # Create list of (option, is_correct) tuples
    options_with_flag = [(opt, opt == correct_answer) for opt in options]
    
    # Shuffle until we get a different answer index than previous
    max_attempts = 20
    for attempt in range(max_attempts):
        random.shuffle(options_with_flag)
        new_index = next(i for i, (_, is_correct) in enumerate(options_with_flag) if is_correct)
        
        # Accept if different from previous, or if we've tried too many times
        if new_index != previous_index or attempt == max_attempts - 1:
            break
    
    # Update question
    question['options'] = [opt for opt, _ in options_with_flag]
    question['answerIndex'] = new_index
    previous_index = new_index

# Write back
with open('dataBank/dataSub/uxDataQBank.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print("Randomized answer positions in uxDataQBank.json")
print(f"Answer indices: {[q['answerIndex'] for q in questions]}")
