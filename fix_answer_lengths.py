import json
from pathlib import Path

def expand_option(short_option, target_length, context=""):
    """Expand a short incorrect option to match target length while keeping it plausible but wrong."""
    current_length = len(short_option)
    
    if current_length >= target_length * 0.8:  # If already 80% of target, leave it
        return short_option
    
    # Common expansion patterns
    if "only" in short_option.lower():
        # Add more specific details
        short_option = short_option.rstrip('.') + " and related design considerations"
    elif short_option.endswith("?"):
        short_option = short_option
    else:
        # Add contextual elaboration
        if len(short_option) < 30:
            if "design" in short_option.lower():
                short_option += " guidelines and visual styling choices"
            elif "system" in short_option.lower() or "performance" in short_option.lower():
                short_option += " metrics and technical specifications"
            elif "user" in short_option.lower():
                short_option += " research and behavioral analysis"
            elif "cost" in short_option.lower() or "budget" in short_option.lower():
                short_option += " allocation and financial planning"
            elif "marketing" in short_option.lower() or "branding" in short_option.lower():
                short_option += " strategies and promotional campaigns"
            elif "speed" in short_option.lower() or "fast" in short_option.lower():
                short_option += " optimization and performance tuning"
            else:
                short_option += " and implementation details"
    
    # If still too short, add more generic expansion
    if len(short_option) < target_length * 0.7:
        short_option += " for optimal results"
    
    return short_option

def fix_question(question):
    """Fix a question where the correct answer is much longer than incorrect ones."""
    options = question['options']
    answer_index = question['answerIndex']
    correct_answer = options[answer_index]
    
    correct_length = len(correct_answer)
    
    # Expand each incorrect option
    new_options = []
    for i, opt in enumerate(options):
        if i == answer_index:
            new_options.append(opt)
        else:
            # Target 70-90% of correct answer length
            expanded = expand_option(opt, correct_length * 0.8)
            new_options.append(expanded)
    
    question['options'] = new_options
    return question

def main():
    # Problems from the analysis (top 40)
    problems = [
        ('chapter6.json', 31),
        ('chapter10.json', 14),
        ('chapter6.json', 28),
        ('chapter6.json', 13),
        ('chapter5.json', 23),
        ('chapter10.json', 22),
        ('chapter5.json', 27),
        ('chapter7.json', 19),
        ('chapter10.json', 26),
        ('chapter5.json', 28),
        ('chapter7.json', 21),
        ('chapter8.json', 6),
        ('chapter8.json', 1),
        ('chapter10.json', 16),
        ('chapter10.json', 18),
        ('chapter8.json', 9),
        ('chapter10.json', 6),
        ('chapter10.json', 29),
        ('chapter5.json', 24),
        ('chapter7.json', 30),
        ('chapter10.json', 15),
        ('chapter6.json', 29),
        ('chapter3.json', 12),
        ('chapter10.json', 10),
        ('chapter7.json', 27),
        ('chapter7.json', 2),
        ('chapter7.json', 25),
        ('chapter10.json', 30),
        ('chapter6.json', 6),
        ('chapter3.json', 17),
        ('chapter10.json', 19),
        ('chapter6.json', 1),
        ('chapter10.json', 8),
        ('chapter10.json', 11),
        ('chapter5.json', 22),
        ('chapter10.json', 1),
        ('chapter3.json', 24),
        ('chapter8.json', 21),
        ('chapter3.json', 10),
        ('chapter6.json', 21),
    ]
    
    databank_path = Path(r'c:\Users\Neuye\Documents\power\dataBank')
    
    # Group by file
    files_to_fix = {}
    for filename, qid in problems:
        if filename not in files_to_fix:
            files_to_fix[filename] = []
        files_to_fix[filename].append(qid)
    
    # Process each file
    for filename, question_ids in files_to_fix.items():
        filepath = databank_path / filename
        
        print(f"\\nProcessing {filename}...")
        
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            questions = json.load(f)
        
        fixed_count = 0
        for question in questions:
            if question['id'] in question_ids:
                # Check if it actually needs fixing
                options = question['options']
                answer_index = question['answerIndex']
                correct_length = len(options[answer_index])
                incorrect_lengths = [len(opt) for i, opt in enumerate(options) if i != answer_index]
                avg_incorrect = sum(incorrect_lengths) / len(incorrect_lengths)
                
                if correct_length > avg_incorrect * 1.4:  # 40% longer
                    print(f"  Fixing Q{question['id']}: correct={correct_length}, avg_incorrect={avg_incorrect:.0f}")
                    fix_question(question)
                    fixed_count += 1
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        
        print(f"  Fixed {fixed_count} questions in {filename}")
    
    print("\\nDone! All files updated.")

if __name__ == '__main__':
    main()
