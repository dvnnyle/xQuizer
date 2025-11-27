import json
import glob

def analyze_questions():
    files = glob.glob("dataBank/chapter[0-9]*.json")
    issues = []
    
    for file in files:
        with open(file, 'r', encoding='utf-8-sig') as f:
            questions = json.load(f)
        
        for q in questions:
            options = q.get("options", [])
            if len(options) < 4:
                continue
                
            lengths = [len(opt) for opt in options]
            answer_idx = q.get("answerIndex", -1)
            
            if answer_idx < 0 or answer_idx >= len(lengths):
                continue
            
            answer_len = lengths[answer_idx]
            other_lens = [lengths[i] for i in range(len(lengths)) if i != answer_idx]
            avg_other = sum(other_lens) / len(other_lens) if other_lens else 0
            
            # Flag if answer is significantly longer (>40% longer than average)
            if answer_len > avg_other * 1.4 and answer_len - avg_other > 20:
                issues.append({
                    "file": file.replace("dataBank\\", ""),
                    "id": q.get("id"),
                    "question": q.get("question")[:60] + "...",
                    "answer_len": answer_len,
                    "avg_other": round(avg_other, 1),
                    "diff_pct": round((answer_len / avg_other - 1) * 100, 1),
                    "options": options,
                    "answer_idx": answer_idx
                })
    
    # Sort by difference percentage
    issues.sort(key=lambda x: x["diff_pct"], reverse=True)
    
    print(f"Found {len(issues)} questions where correct answer is obviously longer:\n")
    for i, issue in enumerate(issues[:15], 1):
        fname = issue['file']
        qid = issue['id']
        pct = issue['diff_pct']
        ans_len = issue['answer_len']
        avg = issue['avg_other']
        ques = issue['question']
        print(f"{i}. {fname} Q{qid}: +{pct}% longer")
        print(f"   Correct: {ans_len} chars | Others avg: {avg}")
        print(f"   {ques}")
        print()

analyze_questions()
