import json
from pathlib import Path

# Manual expansions for specific common patterns
expansions = {
    # Chapter 6
    "Long-term lifestyle change": "Long-term lifestyle change and sustained behavioral transformation over extended periods",
    "Marketing campaigns": "Marketing campaigns and promotional messaging strategies for user acquisition",
    "Only visual branding": "Only visual branding guidelines and aesthetic styling choices for interface elements",
    "Single standalone devices only": "Single standalone devices only with isolated functionality and no integration",
    "Back-end architectures": "Back-end architectures and server infrastructure design patterns and optimization",
    "Printer drI'vers": "Printer drI'vers and hardware compatibility layer protocols for peripheral devices",
    "Financial commitment to a product": "Financial commitment to a product through subscription or purchase decisions",
    "Legal contracts with users": "Legal contracts and binding agreements established with service users",
    "Download counts in an app store": "Download counts and installation metrics tracked in mobile app stores",
    "From desktop to mobile devices": "From desktop computing platforms to mobile device interfaces and touch interactions",
    "From user research to pure aesthetics": "From user research methodologies to pure aesthetics and visual design decisions only",
    "From qualitatI've methods to only data analytics": "From qualitatI've methods and interviews to only data analytics and metrics tracking",
    
    # Chapter 10
    "Only graphic design rules": "Only graphic design rules and visual styling guidelines for aesthetics and branding",
    "Only legal requirements": "Only legal requirements and regulatory compliance standards for data protection",
    "Only back-end performance": "Only back-end performance metrics like server response times and database queries",
    "To double project cost": "To double project cost and maximize the budget allocation for evaluation activities",
    "To avoid planning tasks": "To avoid planning tasks and eliminate the need for structured evaluation protocols",
    "So that users never see unfinished designs": "So that users never see unfinished designs and only experience polished final products",
    "Because labs are always better": "Because labs are always better and provide more controlled experimental conditions",
    "So that tests are shorter": "So that tests are shorter and evaluation sessions require less time to complete",
    "So we can avoid recruiting users": "So we can avoid recruiting users and rely solely on automated testing approaches",
    "Asking managers for their opinions": "Asking managers for their opinions and gathering stakeholder feedback sessions",
    "Designing logos and branding": "Designing logos and branding guidelines for visual identity systems and marketing",
    "Writing user manuals": "Writing user manuals and technical documentation for end users and support teams",
    "Checking code quality": "Checking code quality and reviewing software architecture patterns and structures",
    "Comparing design tools": "Comparing design tools and evaluating software platform capabilities and features",
    "Only counting page views": "Only counting page views and tracking basic analytics metrics data collection",
    "Any person can reveal all problems": "Any person can reveal all problems regardless of background or expertise level",
    "Only experts can participate": "Only experts can participate effectively in meaningful usability testing sessions",
    "It reduces the need for planning": "It reduces the need for planning detailed test protocols and evaluation criteria",
    "Two experts argue about the best design": "Two experts argue about the best design and debate optimal solutions verbally",
    "The same user tests the design twice in a row": "The same user tests the design twice in a row to compare experiences",
    "Only visual design is evaluated": "Only visual design is evaluated without considering functional aspects or usability",
    "Only developers test their own code": "Only developers test their own code without external validation or user feedback",
    "Random users try the system at home": "Random users try the system at home without structured protocols or guidance",
    "Managers fill in a satisfaction survey": "Managers fill in a satisfaction survey based on their personal preferences",
    "Picking colour palettes": "Picking colour palettes and selecting visual design themes for branding purposes",
    "Designing icons": "Designing icons and creating graphical elements for user interface components",
    "Writing legal terms and conditions": "Writing legal terms and conditions documentation for compliance and user agreements",
    "One method is always perfect": "One method is always perfect and provides complete evaluation coverage alone",
    "It reduces the need for planning": "It reduces the need for planning structured evaluation protocols and criteria",
    "It makes reports unnecessary": "It makes reports unnecessary because findings are self-evident to all stakeholders",
    "A design principle": "A design principle or guideline for interface construction and layout decisions",
    "A type of user error": "A type of user error or mistake made during task completion attempts",
    "A measure of satisfaction": "A measure of satisfaction or user sentiment about the product experience",
    
    # Chapter 5
    "System cost only": "System cost only and pricing structure considerations for budget allocation",
    "Marketing channels": "Marketing channels and promotional distribution strategies for user acquisition",
    "File size": "File size limitations and storage capacity requirements for deployments",
    "Ads, branding, speed": "Ads, branding guidelines, and processing speed optimization for performance",
    "Animations only": "Animations only without considering other interaction patterns or feedback",
    "Removing navigation": "Removing navigation elements to create minimalist interfaces with hidden controls",
    "Only color theory": "Only color theory and palette selection for visual appeal and aesthetics",
    "Only typography": "Only typography choices and font pairing decisions for readability",
    "Only gestures": "Only gestures and touch-based interaction patterns for mobile interfaces",
    "UI colors": "UI colors and visual design aesthetic choices only for interface styling",
    "CPU speed": "CPU speed and processor performance optimization metrics for technical efficiency",
    "Server uptime": "Server uptime and infrastructure reliability percentages for availability monitoring",
    "How fast system loads": "How fast system loads and performance response times for user interactions",
    "How many icons exist": "How many icons exist in the interface design system and icon libraries",
    "How bright screen is": "How bright screen is and display luminosity settings for visibility",
    
    # Chapter 7
    "To immediately sketch user interfaces": "To immediately sketch user interfaces and create visual mockups without research",
    "To choose the technology stack": "To choose the technology stack and select development frameworks and tools",
    "To write the final user manual": "To write the final user manual and end-user documentation for deployment",
    "To make the document longer": "To make the document longer and increase page count without adding value",
    "To confuse stakeholders": "To confuse stakeholders and obscure requirements with unnecessary complexity",
    "To replace the need for testing": "To replace the need for testing and validation with real users later",
    "Only colourful icons and branding": "Only colourful icons and branding guidelines for visual identity systems",
    "Developer names and salaries": "Developer names and salaries information for human resources tracking",
    "A list of all meetings held": "A list of all meetings held during the project planning phase",
    "It replaces user stories": "It replaces user stories entirely and eliminates the need for agile artifacts",
    "It is used only for bug fixing": "It is used only for bug fixing and defect tracking in maintenance phase",
    "It decides the team size": "It decides the team size and resource allocation for development efforts",
    "Essential requirements": "Essential requirements that are critical and cannot be compromised or removed",
    "Requirements that break the system": "Requirements that break the system and cause technical failures if implemented",
    "Requirements that are illegal": "Requirements that are illegal and violate regulatory compliance standards",
    "PACT replaces requirements completely": "PACT replaces requirements completely and eliminates the need for specifications",
    "PACT is irrelevant once coding starts": "PACT is irrelevant once coding starts and developers begin implementation work",
    
    # Chapter 8
    "To finalize code before testing": "To finalize code before testing and complete implementation without iteration",
    "To gather business requirements": "To gather business requirements and document stakeholder needs systematically",
    "To conduct data analytics": "To conduct data analytics and analyze quantitative metrics from usage data",
    "Always paper-based": "Always paper-based prototypes without any digital representations or tools",
    "Used only after deployment": "Used only after deployment to production environments with real users",
    "Not suitable for evaluation": "Not suitable for evaluation or user testing due to limited interactivity",
    "Database schema": "Database schema and data model entity relationship diagrams for storage",
    "Final UI code": "Final UI code with complete implementation ready for production deployment",
    "Marketing personas": "Marketing personas and customer segmentation profiles for campaigns",
    "Eliminating need for feedback": "Eliminating need for feedback and removing iteration from the process",
    "Finalising design instantly": "Finalising design instantly without iteration or refinement based on testing",
    "Reducing design options": "Reducing design options and limiting creative exploration of alternatives",
    
    # Chapter 3
    "Exact pixel-perfect layout of buttons": "Exact pixel-perfect layout of buttons and precise positioning specifications",
    "Only the database schema": "Only the database schema and data storage structure without interface design",
    "Colour palettes and branding": "Colour palettes and branding guidelines for visual identity systems",
    "To generate final code for deployment": "To generate final code for deployment and complete implementation automatically",
    "To replace user research completely": "To replace user research completely and eliminate the need for user studies",
    "To measure server performance under load": "To measure server performance under load and test infrastructure capacity",
    "A UML diagram of system classes": "A UML diagram of system classes showing object-oriented architecture structure",
    "A list of system requirements": "A list of system requirements and functional specifications for developers",
    "A detailed budget for the project": "A detailed budget for the project including cost estimates and resource allocation",
    "To store all the analytics data": "To store all the analytics data and maintain comprehensive usage metrics",
    "To describe technical implementation details like database indexes": "To describe technical implementation details like database indexes and query optimization",
    "To specify only visual style rules": "To specify only visual style rules and aesthetic guidelines without functionality",
}

def expand_option_custom(opt):
    """Use manual expansions or generate contextual one."""
    if opt in expansions:
        return expansions[opt]
    return opt

def fix_question(question):
    """Fix a question by expanding short incorrect options."""
    options = question['options']
    answer_index = question['answerIndex']
    
    new_options = []
    for i, opt in enumerate(options):
        if i == answer_index:
            new_options.append(opt)
        else:
            expanded = expand_option_custom(opt)
            new_options.append(expanded)
    
    question['options'] = new_options
    return question

def main():
    # All identified problem questions from analysis
    problems = [
        ('chapter6.json', [1, 6, 13, 21, 28, 29, 31]),
        ('chapter10.json', [1, 6, 8, 10, 11, 15, 16, 18, 19, 29, 30]),
        ('chapter5.json', [22, 23, 24, 27, 28]),
        ('chapter7.json', [2, 19, 21, 25, 27, 30]),
        ('chapter8.json', [1, 6, 9, 21]),
        ('chapter3.json', [10, 12, 17, 24]),
    ]
    
    databank_path = Path(r'c:\Users\Neuye\Documents\power\dataBank')
    
    total_fixed = 0
    for filename, question_ids in problems:
        filepath = databank_path / filename
        
        print(f"\\nProcessing {filename}...")
        
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            questions = json.load(f)
        
        fixed_count = 0
        for question in questions:
            if question['id'] in question_ids:
                print(f"  Fixing Q{question['id']}")
                fix_question(question)
                fixed_count += 1
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        
        print(f"  ✓ Fixed {fixed_count} questions in {filename}")
        total_fixed += fixed_count
    
    print(f"\\n✓ Done! Fixed {total_fixed} total questions across all files.")

if __name__ == '__main__':
    main()
