import json
import os
from pathlib import Path

def analyze_question(question):
    """Analyze a single question for answer length imbalance."""
    options = question['options']
    answer_index = question['answerIndex']
    correct_answer = options[answer_index]
    
    # Calculate lengths
    correct_length = len(correct_answer)
    incorrect_lengths = [len(opt) for i, opt in enumerate(options) if i != answer_index]
    avg_incorrect_length = sum(incorrect_lengths) / len(incorrect_lengths)
    
    # Calculate percentage difference
    if avg_incorrect_length > 0:
        diff_percentage = ((correct_length - avg_incorrect_length) / avg_incorrect_length) * 100
    else:
        diff_percentage = 0
    
    return {
        'id': question.get('id', 'N/A'),
        'section': question.get('section', 'N/A'),
        'question': question['question'][:80] + '...' if len(question['question']) > 80 else question['question'],
        'correct_length': correct_length,
        'avg_incorrect_length': avg_incorrect_length,
        'diff_percentage': diff_percentage,
        'correct_answer': correct_answer,
        'incorrect_answers': [opt for i, opt in enumerate(options) if i != answer_index]
    }

def main():
    databank_path = Path(r'c:\Users\Neuye\Documents\power\dataBank')
    
    # Files to analyze
    files = [
        'chapter2.json',
        'chapter3.json',
        'chapter5.json',
        'chapter6.json',
        'chapter7.json',
        'chapter8.json',
        'chapter10.json'
    ]
    
    all_problems = []
    
    for filename in files:
        filepath = databank_path / filename
        
        if not filepath.exists():
            print(f"Warning: {filename} not found")
            continue
        
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            questions = json.load(f)
        
        print(f"\nAnalyzing {filename}...")
        print(f"Total questions: {len(questions)}")
        
        for question in questions:
            analysis = analyze_question(question)
            
            # Flag questions where correct answer is 40%+ longer
            if analysis['diff_percentage'] >= 40:
                analysis['file'] = filename
                all_problems.append(analysis)
    
    # Sort by difference percentage (highest first)
    all_problems.sort(key=lambda x: x['diff_percentage'], reverse=True)
    
    print(f"\n{'='*100}")
    print(f"FOUND {len(all_problems)} QUESTIONS WITH CORRECT ANSWER 40%+ LONGER THAN AVERAGE")
    print(f"{'='*100}\n")
    
    # Show top 40 problems
    for i, problem in enumerate(all_problems[:40], 1):
        print(f"{i}. {problem['file']} - Q{problem['id']} (Section {problem['section']})")
        print(f"   Difference: +{problem['diff_percentage']:.1f}%")
        print(f"   Question: {problem['question']}")
        print(f"   Correct ({problem['correct_length']} chars): {problem['correct_answer']}")
        print(f"   Avg incorrect length: {problem['avg_incorrect_length']:.0f} chars")
        print(f"   Incorrect options:")
        for j, opt in enumerate(problem['incorrect_answers'], 1):
            print(f"      {j}. ({len(opt)} chars) {opt}")
        print()
    
    # Save full report
    with open('answer_length_report.json', 'w', encoding='utf-8') as f:
        json.dump(all_problems, f, indent=2, ensure_ascii=False)
    
    print(f"\nFull report saved to answer_length_report.json")
    print(f"Total problematic questions found: {len(all_problems)}")

if __name__ == '__main__':
    main()
