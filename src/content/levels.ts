import type { Level } from "@/lib/levels";

/**
 * THE SYLLABUS
 * ============
 * The whole course is one straight path from "what is a variable" to
 * "I shipped a real Django + DRF application". Every chapter teaches ONE
 * actual topic (no fancy game names hide the syllabus anymore) and every
 * Django chapter adds one piece to the same running project: DinoShop,
 * a small online shop the learner builds chapter by chapter until it is
 * a real, deployed application with an API.
 *
 * The goal: by chapter 100 the learner has BUILT a big application
 * themselves and can repeat the process on their own idea.
 */

/** Detailed Levels 0-9. Written in simple language for beginners. */
export const LEVELS_0_9: Level[] = [
  {
    id: 0,
    slug: "print-village",
    title: "Hello, Print Village",
    topic: "print() output",
    projectGoal: "Make the computer talk: your first line of Python",
    track: "python",
    world: "Python Playground",
    storyKid:
      "Djano wakes up in Print Village where everyone shouts by printing. Your first technique is print(). It makes the computer talk back. Let us say hello to the world.",
    mission: "Use print() to show the text: Hello, Django!",
    analogy10yo: "print() works like a megaphone. Whatever you put inside the brackets, the computer says out loud.",
    exampleCode: `print("Hello, Dino!")\nprint("I love mangoes")`,
    exampleWalkthrough: [
      "Line 1: print, then round brackets, then text in quotes. Python shows: Hello, Dino!",
      "Line 2: exactly the same shape with different text. Python shows: I love mangoes.",
      "Python reads top to bottom and every print writes its own new line.",
    ],
    syntaxPattern: `print("<message>")`,
    syntaxParts: [
      { token: "print", meaning: "The command that makes the computer show something on the screen. Always lowercase." },
      { token: "( )", meaning: "Round brackets hold what you want to print. Never a space between print and the bracket." },
      { token: '"<message>"', meaning: "The text to show, wrapped in quotes. Replace the whole thing with your own words, quotes included.", placeholder: true },
    ],
    starterCode: `# Your turn. Type the line below exactly (all lowercase):\n# print("Hello, Django!")\n`,
    guidedLesson: {
      objective:
        "You will know exactly what print() does, why the brackets are there, and why the text needs quotes.",
      steps: [
        {
          title: "A computer waits for an instruction",
          body:
            "A computer never talks on its own. It sits still until you give it a command. The command that makes it say something out loud is print().",
          code: `print("Hello")`,
          why: "print is the command name, and what follows tells it what to say.",
        },
        {
          title: "The brackets are the mouth",
          body:
            "The round brackets after print hold the thing you want to say. Forget them and Python cannot even read the line. The shape is always print( something ).",
          code: `print("Hello, Django!")`,
          why: "The brackets pass your text into the print command.",
        },
        {
          title: "Quotes mean real text",
          body:
            "Anything wrapped in quotes is text, and programmers call text a string. Without quotes Python looks for a variable with that name and fails. So write print(\"Hello\") and never print(Hello).",
          code: `print("Hello")  # text in quotes works\n# print(Hello)  # no quotes: Python hunts for a variable named Hello`,
          why: "Quotes tell Python: this is plain text, do not look it up.",
        },
        {
          title: "Small letters matter",
          body:
            "Python is picky about capitals. print with a small p is a command, Print with a big P is an unknown word. If a line ever fails, check the capitals first.",
          code: `print("small p works")`,
          why: "Python names are case sensitive, so print and Print are different words.",
        },
      ],
      checkQuestion: "Why does print(\"Hello\") need quotes around Hello?",
      checkAnswer:
        "Quotes mark it as plain text. Without them Python looks for a variable named Hello, does not find one, and reports a NameError.",
      takeaways: [
        "print() is the command that makes the computer say something.",
        "Brackets ( ) hold what to say, and quotes mark text.",
        "Keep print lowercase, and write one instruction per line.",
      ],
      generatedBy: "Django Adventure course team",
    },
    language: "python",
    runnable: true,
    tests: [
      {
        name: "prints Hello, Django!",
        expectContains: ["Hello, Django!"],
      },
    ],
    rubricForGemini:
      "User must call print with the exact string 'Hello, Django!'. Accept single or double quotes. Case and punctuation must match.",
    hints: [
      "Type: print(\"Hello, Django!\") and keep the quotes.",
      "print needs parentheses () around the text.",
      "Copy the line exactly, then press RUN.",
    ],
    xp: 20,
  },
  {
    id: 1,
    slug: "lunchbox-variables",
    title: "Lunchbox Variables",
    topic: "Variables",
    projectGoal: "Store your shop's name and price in variables",
    track: "python",
    world: "Python Playground",
    storyKid:
      "In Django Land, variables are lunchboxes with name tags. You put snacks (values) inside and read the tag to find them. Djano packed 3 boxes but forgot the labels.",
    mission: "Create a variable named hero with the value Djano, then print it.",
    analogy10yo: "A variable is a lunchbox. hero = Djano means: stick a tag that says hero on a box holding Djano.",
    exampleCode: `snack = "mango"\nprint(snack)\n\nage = 10\nprint(age)`,
    exampleWalkthrough: [
      "Line 1: a box named snack is created and the text mango is stored inside it.",
      "Line 2: print(snack) opens that box and says mango. No quotes here, so Python reads the box.",
      "Line 3 is empty, just spacing for humans; Python ignores it.",
      "Line 4: a second box named age holds the number 10. Numbers never need quotes.",
      "Line 5 prints what is inside age, so Python shows 10.",
    ],
    syntaxPattern: `<name> = <value>`,
    syntaxParts: [
      { token: "<name>", meaning: "The box label you choose: letters, numbers and _ only, no spaces, cannot start with a number.", placeholder: true },
      { token: "=", meaning: "Means put the right side into the box named on the left. Not equals in the maths sense." },
      { token: "<value>", meaning: "What to store. Text needs quotes like \"mango\", numbers never do: 10.", placeholder: true },
    ],
    starterCode: `# Create the hero variable and print it\n# hero = "Djano"\n# print(hero)\n`,
    guidedLesson: {
      objective:
        "You will understand that a variable is a named box, that = puts a value inside it, and when Python needs quotes.",
      steps: [
        {
          title: "A box with a name tag",
          body:
            "A variable is a box you stick a name on, so you can find the value again later. This line makes a box called hero and drops the text Djano inside.",
          code: `hero = "Djano"`,
          why: "Writing a name with = creates the box the first time.",
        },
        {
          title: "The = sign is an arrow, not equals",
          body:
            "In Python = does not mean equals in maths. It means: take the thing on the right and put it into the box named on the left. Python always reads the right side first.",
          code: `hero = "Djano"\nage = 10`,
          why: "Two boxes, two values, each stored under its own name.",
        },
        {
          title: "Quotes for text, no quotes for numbers",
          body:
            "Text must sit in quotes, otherwise Python hunts for a variable with that name. Numbers work without quotes, and only numbers can be added together later.",
          code: `hero = "Djano"\nage = 10\nprint(hero)\nprint(age)`,
          why: "Quotes make text; no quotes mean Python reads a number or a name directly.",
        },
        {
          title: "Print the box, not the word",
          body:
            "print(hero) opens the box and shows Djano. print(\"hero\") shows the four letters h-e-r-o, because quotes turn a name into ordinary text. The name you use must match letter for letter, capitals included.",
          code: `hero = "Djano"\nprint("hero")   # shows the word hero\nprint(hero)     # shows Djano`,
          why: "Quotes decide whether Python looks inside a box or just reads the text.",
        },
      ],
      checkQuestion: "What is the difference between print(hero) and print(\"hero\")?",
      checkAnswer:
        "print(hero) looks inside the box named hero and shows its value Djano. print(\"hero\") shows the plain text hero.",
      takeaways: [
        "A variable is a named box for a value.",
        "= means put the right side into the box on the left.",
        "Text needs quotes, numbers do not.",
        "Names are case sensitive and must match exactly.",
      ],
      generatedBy: "Django Adventure course team",
    },
    language: "python",
    runnable: true,
    tests: [
      { name: "defines hero", assertCode: `assert hero == "Djano", "hero should be 'Djano'"` },
      { name: "prints Djano", expectContains: ["Djano"] },
    ],
    rubricForGemini: "Must define hero = 'Djano' (or double quotes) and print(hero) or print('Djano'). Variable name must be hero.",
    hints: [
      "Step 1: hero = \"Djano\"",
      "Step 2: print(hero) with no quotes around hero.",
      "Text needs quotes, variable names do not.",
    ],
    xp: 20,
  },
  {
    id: 2,
    slug: "forky-path-if-else",
    title: "Forky Path: if and else",
    topic: "if / else decisions",
    projectGoal: "Decide who gets a discount in your shop",
    track: "python",
    world: "Python Playground",
    storyKid:
      "You reach a fork in the road. If you hold a key, the gate opens. Otherwise, you take the other path. Computers decide with if and else too.",
    mission:
      "The variable age is already 10. Write a decision: if age is 10 or more print You can ride!, otherwise print Eat more mangoes. Exactly one of the two lines should print. Mind the colon and the 4-space indentation.",
    analogy10yo: "if works like a traffic signal. If the signal is green (True), you take one road. Otherwise you take the other road.",
    exampleCode: `age = 7\n\nif age >= 10:\n    print("You can ride!")\nelse:\n    print("Eat more mangoes!")`,
    exampleWalkthrough: [
      "Line 1: the box age holds the number 7.",
      "Line 3: if age >= 10: asks a yes or no question. 7 >= 10 is False, so the if is not taken.",
      "Line 4 is indented with 4 spaces, so it belongs to the if. Python skips it because the question was False.",
      "Line 5: else: means otherwise, do this instead.",
      "Line 6 is indented, so it belongs to the else, and Python runs it: Eat more mangoes!",
      "Change line 1 to age = 10 and run again: now the if is True and you see You can ride!",
    ],
    syntaxPattern: `if <condition>:\n    <do this>\nelse:\n    <do that instead>`,
    syntaxParts: [
      { token: "if", meaning: "The keyword that asks a yes or no question. Always lowercase." },
      { token: "<condition>", meaning: "The question, built from a comparison: age >= 10, name == \"Djano\", price < 5. It must end in True or False.", placeholder: true },
      { token: ":", meaning: "The colon opens the block. It is required after the if line and after else, and Python refuses to run without it." },
      { token: "    <do this>", meaning: "The indented line, 4 spaces in, runs only when the question is True.", placeholder: true },
      { token: "else:", meaning: "The second road. Runs only when the question is False. Needs its own colon and its own indented block." },
      { token: "    <do that instead>", meaning: "The indented line, 4 spaces in, runs only when the question is False.", placeholder: true },
    ],
    starterCode: `age = 10\n# 1) if age >= 10:   (do not forget the colon)\n# 2) indent 4 spaces and print("You can ride!")\n# 3) else:  then indent and print("Eat more mangoes!")\n`,
    guidedLesson: {
      objective:
        "You will understand how Python chooses between two paths with if and else, and why the colon and the 4 spaces are not optional.",
      steps: [
        {
          title: "A question with a yes or no answer",
          body:
            "if asks Python a question. When the answer is True, Python runs the line underneath it. Here it asks: is age at least 10? The symbol >= means at least.",
          code: `age = 10\nif age >= 10:\n    print("You can ride!")`,
          why: "The question decides whether the line under the if runs.",
        },
        {
          title: "The colon opens the door",
          body:
            "Every if line ends with a colon : . The colon means the lines that follow belong to this question. Leave it out and Python stops with a SyntaxError before anything runs.",
          code: `if age >= 10:\n    print("You can ride!")`,
          why: "The colon says: here comes the block that belongs to this if.",
        },
        {
          title: "Indentation shows what belongs",
          body:
            "The 4 spaces in front of print make it part of the if block. A line back at the left edge is outside the if and always runs. Python reads indentation as meaning, so one extra space changes the program.",
          code: `if age >= 10:\n    print("inside the if")\n\nprint("always runs, even when the question is False")`,
          why: "Indented means inside the block, unindented means after the block.",
        },
        {
          title: "else is the other road",
          body:
            "else gives Python a second path for when the question is False. It needs its own colon and its own indented block. Exactly one of the two blocks always runs, never both and never none.",
          code: `age = 7\nif age >= 10:\n    print("You can ride!")\nelse:\n    print("Eat more mangoes!")`,
          why: "else covers every case the if did not take.",
        },
      ],
      checkQuestion:
        "In the example, age is 7. Why does Python show Eat more mangoes! and not You can ride!?",
      checkAnswer:
        "7 >= 10 is False, so the if block is skipped and Python runs the else block instead.",
      takeaways: [
        "if asks a question, else handles the False case.",
        "Every if and else line ends with a colon.",
        "Indent the body 4 spaces; the indentation is part of the meaning.",
        ">= means at least, > means more than, == compares two values.",
      ],
      generatedBy: "Django Adventure course team",
    },
    language: "python",
    runnable: true,
    tests: [{ name: "prints ride message", expectContains: ["You can ride!"] }],
    rubricForGemini: "Must use if age >= 10 with correct prints. Accept age = 10 preset. Check colon and indentation conceptually.",
    hints: [
      "Start with: if age >= 10:",
      "Next line indented with 4 spaces: print(\"You can ride!\")",
      "Then add else: plus print(\"Eat more mangoes!\")",
    ],
    xp: 30,
  },
  {
    id: 3,
    slug: "loop-lake",
    title: "Loop Lake: for loops",
    topic: "for loops",
    projectGoal: "Print every product name in your catalog",
    track: "python",
    world: "Python Playground",
    storyKid:
      "Djano must feed 5 baby dinosaurs. Doing it one by one is slow. A for loop repeats the work for you, like a copy machine.",
    mission:
      "Loop 3 times and print Mango! each time, using for i in range(3). It must come from the loop: typing three print lines by hand is not a loop.",
    analogy10yo: "A loop is a merry-go-round. range(3) means 3 rounds: round 0, round 1, round 2.",
    exampleCode: `# range(3) counts 0, 1, 2: three rounds\nfor i in range(3):\n    print(i)\n\n# the same loop shape, printing a word every round\nfor i in range(3):\n    print("Mango!")`,
    exampleWalkthrough: [
      "Line 2: for i in range(3): is the loop header. Read it as: for each number in range(3), do the block below.",
      "range(3) produces three numbers, 0 then 1 then 2, and stops before 3.",
      "i is the loop variable: a name that holds the current number, so the first round i is 0, then 1, then 2.",
      "Line 3 is indented 4 spaces, so it is the body, the part Python repeats. It runs three times, so Python shows 0, then 1, then 2.",
      "Line 6 starts a second loop with the same shape but prints the word Mango! each round, so you see Mango! three times.",
      "Change 3 to 5 and the body repeats five times, because there are five numbers in range(5).",
    ],
    syntaxPattern: `for <name> in range(<times>):\n    <repeat this>`,
    syntaxParts: [
      { token: "for", meaning: "The keyword that starts a loop. Every loop header begins with it." },
      { token: "<name>", meaning: "The loop variable you name yourself: i, round_number, anything. It holds the current round number while the body runs.", placeholder: true },
      { token: "in", meaning: "The linking word. It reads naturally: for each number in range(...)." },
      { token: "range(<times>)", meaning: "Counts that many rounds, starting from 0. range(3) gives 0, 1, 2. The last number is never included.", placeholder: true },
      { token: ":", meaning: "The colon ends the loop header. Without it nothing runs at all." },
      { token: "    <repeat this>", meaning: "The indented body, 4 spaces in. Everything indented here is repeated once per round.", placeholder: true },
    ],
    starterCode: `# 1) write the loop header: for i in range(3):\n# 2) indent 4 spaces, then print("Mango!")\n`,
    language: "python",
    runnable: true,
    guidedLesson: {
      objective:
        "You will understand what a for loop repeats, what the name i holds, and exactly what range(3) counts, so you can write a loop yourself from scratch.",
      steps: [
        {
          title: "Repeating without writing it three times",
          body:
            "If you want the same line three times, you could copy it three times and change it later you would have to copy every place. A loop writes the work once and lets Python repeat it. The loop header reads out loud as: for each number in range(3), do the block below.",
          code: `for i in range(3):\n    print("Mango!")`,
          why: "The body is written once and runs as many times as range counts.",
        },
        {
          title: "range(3) means the numbers 0, 1, 2",
          body:
            "range(3) does not mean the number 3. It produces a run of numbers that starts at 0 and stops before 3: so 0, then 1, then 2. Three numbers means three rounds. Run this and watch the numbers appear.",
          code: `for i in range(3):\n    print(i)`,
          why: "The loop runs once for every number range gives it.",
        },
        {
          title: "i is a name you choose",
          body:
            "i is the loop variable, a box that holds the current number on each round. Python does not care what you call it, so round_number works just as well. What matters is the order: for NAME in range(...).",
          code: `for round_number in range(3):\n    print(round_number)`,
          why: "The loop variable holds the next number on every round.",
        },
        {
          title: "The colon and the indented body",
          body:
            "Exactly like if, the loop header ends with a colon, and the indented lines below are the body that repeats. A line back at the left edge is outside the loop and runs once, after the loop has finished.",
          code: `for i in range(3):\n    print("Mango!")\n    print("one more round done")\n\nprint("loop finished")`,
          why: "Both indented lines repeat three times, and the last line runs once at the end.",
        },
        {
          title: "Another number means more rounds",
          body:
            "The only thing you change to repeat more is the number inside range. range(5) gives 0, 1, 2, 3, 4, so five rounds. Try guessing how many lines appear before you run it.",
          code: `for i in range(5):\n    print("Mango!")`,
          why: "The count inside range decides how many times the body runs.",
        },
      ],
      checkQuestion:
        "How many times does the body run in for i in range(4): print(\"Hi\"), and what does i hold each round?",
      checkAnswer:
        "Four times, because range(4) gives 0, 1, 2 and 3. On those rounds i holds 0, then 1, then 2, then 3.",
      takeaways: [
        "A for loop repeats the indented body once per number in range.",
        "range(3) counts 0, 1, 2 and stops before 3.",
        "The loop variable i holds the current number and can be renamed freely.",
        "The header ends with a colon, and the indentation is part of the meaning.",
      ],
      generatedBy: "Django Adventure course team",
    },
    tests: [
      {
        name: "prints Mango! exactly 3 times",
        expectCount: [{ text: "Mango!", times: 3 }],
        assertCode: `assert __stdout_text.count("Mango!") == 3, "The loop body must print Mango! 3 times"`,
      },
    ],
    rubricForGemini:
      "Mission: a for loop over range(3) that prints Mango! exactly 3 times. Pass only when the run shows Mango! 3 times. If the learner wrote print(\"Mango!\") by hand, or used range(5), or printed nothing, explain gently that the loop is what repeats the work and that range(3) counts 0, 1, 2. Be lenient about the loop variable name (i, n, round_number) and about single versus double quotes.",
    hints: [
      "Type: for i in range(3):",
      "Indent the next line and print(\"Mango!\")",
      "range(3) means exactly 3 repeats.",
    ],
    xp: 30,
  },
  {
    id: 4,
    slug: "list-train",
    title: "List Train",
    topic: "Lists",
    projectGoal: "Keep your shop's products in a list",
    track: "python",
    world: "Python Playground",
    storyKid:
      "All aboard the List Train. Each coach holds one toy. You can count them, add new ones, and pick one with position [0].",
    mission:
      "Make a list named toys holding ball, kite, robot in that order, then print the first item with toys[0].",
    analogy10yo: "A list is a train. toys[0] is the first coach. Python counting starts at 0.",
    exampleCode: `fruits = ["mango", "banana"]\nprint(fruits[0])\nprint(len(fruits))\nfruits.append("apple")\nprint(fruits)`,
    exampleWalkthrough: [
      "Line 1: square brackets make a list. It holds two texts, mango and banana, separated by a comma.",
      "Line 2: fruits[0] means item at position 0, which is the first item, so Python shows mango. Counting starts at 0, not 1.",
      "Line 3: len(fruits) asks how many items are inside and shows 2. len is short for length.",
      "Line 4: append adds a new item to the end of the list, so apple joins the train.",
      "Line 5: the list now holds three items, so Python shows all of them in order inside square brackets.",
    ],
    syntaxPattern: `<list_name> = [<item>, <item>, ...]\n<list_name>[0]`,
    syntaxParts: [
      { token: "<list_name>", meaning: "The name you choose for the list, like toys or products.", placeholder: true },
      { token: "[ ]", meaning: "Square brackets start and end a list. The items live between them." },
      { token: "<item>, <item>", meaning: "The values in order, separated by commas. Text items need quotes: \"ball\".", placeholder: true },
      { token: "[0]", meaning: "Square brackets with a position number read one item. 0 is the first item, 1 the second, and so on." },
    ],
    starterCode: `# 1) toys = ["ball", "kite", "robot"]\n# 2) print(toys[0])   (position 0 is the first item)\n`,
    guidedLesson: {
      objective:
        "You will understand that a list keeps values in order, that positions start at 0, and how to count and grow a list.",
      steps: [
        {
          title: "A train of values",
          body:
            "A list keeps many values together, in the order you write them. Square brackets [] start and end the list, and commas separate the items.",
          code: `toys = ["ball", "kite", "robot"]`,
          why: "Square brackets tell Python this is one list holding three items.",
        },
        {
          title: "Positions start at 0",
          body:
            "To read one item, put its position in square brackets after the name. toys[0] is the first item, toys[1] the second. Python always counts from 0, so the third item is toys[2].",
          code: `toys = ["ball", "kite", "robot"]\nprint(toys[0])\nprint(toys[1])`,
          why: "The number inside the brackets is the position, and the first position is 0.",
        },
        {
          title: "Counting what is inside",
          body:
            "len tells you how many items a list holds. len(toys) is 3. This is handy later when you loop over a list, because you can repeat once per item.",
          code: `toys = ["ball", "kite", "robot"]\nprint(len(toys))`,
          why: "len gives the number of items, not the last position.",
        },
        {
          title: "Adding a new item",
          body:
            "append puts a new item at the end of the list. It changes the list itself, so you do not write toys = toys.append(...). A list is a great place to keep your shop products.",
          code: `toys = ["ball", "kite", "robot"]\ntoys.append("drum")\nprint(toys)`,
          why: "append grows the list by one item at the end.",
        },
      ],
      checkQuestion:
        "In toys = [\"ball\", \"kite\", \"robot\"], what is toys[0] and what is toys[2]?",
      checkAnswer:
        "toys[0] is ball, the first item, and toys[2] is robot, because counting starts at 0.",
      takeaways: [
        "A list holds many values in order inside square brackets.",
        "The first item is at position 0, the second at 1.",
        "len(list) counts the items; list.append(x) adds one at the end.",
      ],
      generatedBy: "Django Adventure course team",
    },
    language: "python",
    runnable: true,
    tests: [
      {
        name: "defines toys",
        assertCode: `assert toys == ["ball", "kite", "robot"], "toys should be a list of ball, kite, robot in that order"`,
      },
      { name: "prints ball", expectContains: ["ball"] },
    ],
    rubricForGemini: "Must define toys list exactly with ball/kite/robot and print first element.",
    hints: [
      "Toys line: toys = [\"ball\", \"kite\", \"robot\"]",
      "Print line: print(toys[0])",
      "Position [0] means FIRST item.",
    ],
    xp: 30,
  },
  {
    id: 5,
    slug: "dictionary-cave",
    title: "Dictionary Cave",
    topic: "Dictionaries",
    projectGoal: "Describe one product with name, price, stock keys",
    track: "python",
    world: "Python Playground",
    storyKid:
      "You find a cave of labeled drawers. Dictionaries store things by NAME, not number. Example: pet = {\"name\": \"Djano\"}.",
    mission:
      "Make a dictionary named dino with the key name holding Djano and the key age holding 10, then print dino[\"name\"].",
    analogy10yo: "A dict is a set of labeled drawers. dino[\"name\"] opens the drawer labeled name.",
    exampleCode: `pet = {"name": "Tommy", "color": "brown"}\nprint(pet["name"])\nprint(pet["color"])`,
    exampleWalkthrough: [
      "Line 1: curly brackets make a dictionary. It holds pairs: a key first, then a colon, then the value for that key.",
      "The key \"name\" is text, so it needs quotes. Its value Tommy is text too, so it also has quotes.",
      "Line 2: pet[\"name\"] opens the drawer labelled name, so Python shows Tommy.",
      "Line 3: the same idea with the other key, so Python shows brown.",
      "Unlike a list, you look things up by label instead of by position number.",
    ],
    syntaxPattern: `<dict_name> = {"<key>": <value>}\n<dict_name>["<key>"]`,
    syntaxParts: [
      { token: "<dict_name>", meaning: "The name you choose for the dictionary, like pet or dino.", placeholder: true },
      { token: "{ }", meaning: "Curly brackets start and end a dictionary. Inside live the key and value pairs." },
      { token: '"<key>"', meaning: "The label you store the value under. Keys that are words are text, so they need quotes.", placeholder: true },
      { token: ":", meaning: "The colon inside a pair joins a key to its value. Every pair needs one." },
      { token: "<value>", meaning: "What the key holds: text in quotes or a plain number.", placeholder: true },
      { token: '["<key>"]', meaning: "Square brackets with the key in quotes read the value back. A misspelled key raises a KeyError.", placeholder: true },
    ],
    starterCode: `# 1) dino = {"name": "Djano", "age": 10}\n# 2) print(dino["name"])\n`,
    guidedLesson: {
      objective:
        "You will understand that a dictionary stores values under names called keys, and how to read a value back out.",
      steps: [
        {
          title: "Drawers with labels",
          body:
            "A dictionary keeps pairs together: a key and its value. Curly brackets {} start and end it. Inside, each pair is written as key, then colon, then value.",
          code: `pet = {"name": "Tommy"}`,
          why: "The colon inside a dictionary pairs a label with the value it holds.",
        },
        {
          title: "Open a drawer by its label",
          body:
            "To read a value, use the dictionary name and put the key in square brackets. pet[\"name\"] opens the drawer labelled name.",
          code: `pet = {"name": "Tommy"}\nprint(pet["name"])`,
          why: "Square brackets with a key look up the value stored under that label.",
        },
        {
          title: "Keys are text, so they need quotes",
          body:
            "A dictionary key written as words is text, so it needs quotes both when you create it and when you look it up. Forget the quotes and Python hunts for a variable with that name instead.",
          code: `pet = {"name": "Tommy", "age": 8}\nprint(pet["name"])\nprint(pet["age"])`,
          why: "Values can be text or numbers, and Python shows each one as it is stored.",
        },
        {
          title: "A missing label is an error",
          body:
            "If you ask for a key that is not in the dictionary, Python stops with a KeyError. That is useful: it tells you the label is spelled differently or was never stored. Check the spelling of your keys.",
          code: `pet = {"name": "Tommy"}\nprint(pet["name"])\n# print(pet["colour"]) would give KeyError: colour`,
          why: "Only keys you actually stored can be looked up.",
        },
      ],
      checkQuestion:
        "In a list you use a number like toys[0]. Why does a dictionary need quotes like dino[\"name\"]?",
      checkAnswer:
        "Because list items are found by position number, while dictionary values are found by key, and a key that is words is text, so it needs quotes.",
      takeaways: [
        "A dictionary stores values under labels called keys.",
        "Each pair is written key: value inside curly brackets.",
        "dino[\"name\"] looks up the value stored under that key.",
        "An unknown key raises KeyError, so check your spelling.",
      ],
      generatedBy: "Django Adventure course team",
    },
    language: "python",
    runnable: true,
    tests: [
      {
        name: "defines dino",
        assertCode: `assert dino["name"] == "Djano" and dino["age"] == 10, "dino should have the key name holding Djano and the key age holding 10"`,
      },
      { name: "prints Djano", expectContains: ["Djano"] },
    ],
    rubricForGemini: "Must define dict with name Djano and age 10, and print name.",
    hints: [
      "dino = {\"name\": \"Djano\", \"age\": 10}",
      "print(dino[\"name\"])",
      "Curly brackets {} mean dictionary.",
    ],
    xp: 30,
  },
  {
    id: 6,
    slug: "function-factory",
    title: "Function Factory",
    topic: "Functions",
    projectGoal: "Write a reusable price-with-tax function",
    track: "python",
    world: "Python Playground",
    storyKid:
      "Tired of writing the same lines? Build a factory (function) once, then reuse it. def builds the factory and return packs the result.",
    mission:
      "Define a function greet(name) that returns the text Hello, followed by the name. Then call it inside print so the line print(greet(\"Djano\")) shows Hello, Djano.",
    analogy10yo: "A function is a snack machine. You put an input in, and it returns an output. def builds the machine.",
    exampleCode: `def greet(name):\n    return "Hello, " + name\n\nmessage = greet("Djano")\nprint(message)`,
    exampleWalkthrough: [
      "Line 1: def tells Python you are building a function named greet, and the (name) in the brackets is the input it will accept.",
      "Line 2 is indented, so it belongs to the function. return sends a value back and the + joins the text pieces into one string.",
      "Line 4: greet(\"Djano\") calls the function, so name holds Djano inside it, and the returned text is stored in the box message.",
      "Line 5 prints what came back: Hello, Djano.",
      "Notice that nothing ran on lines 1 and 2 alone. A function only runs when you call it by name with brackets.",
    ],
    syntaxPattern: `def <function_name>(<input>):\n    <work>\n    return <result>\n\n<function_name>(<real value>)`,
    syntaxParts: [
      { token: "def", meaning: "The keyword that builds a function. Short for define. Nothing runs until you call it." },
      { token: "<function_name>", meaning: "The name you choose, lowercase with underscores like greet or add_prices.", placeholder: true },
      { token: "(<input>)", meaning: "The inputs the function accepts, called parameters. A function can also have empty brackets if it needs nothing.", placeholder: true },
      { token: ":", meaning: "The colon ends the def line, and the indented body below belongs to the function." },
      { token: "    <work>", meaning: "The indented lines that do the actual job, 4 spaces in.", placeholder: true },
      { token: "return", meaning: "Hands the result back to whoever called the function. After return the function is finished." },
      { token: "<function_name>(<real value>)", meaning: "The call: name plus brackets with a real value inside. This is the line that actually runs the function.", placeholder: true },
    ],
    starterCode: `# 1) def greet(name):   (do not forget the colon)\n# 2) indent 4 spaces: return "Hello, " + name\n# 3) print(greet("Djano"))\n`,
    guidedLesson: {
      objective:
        "You will understand how to build your own reusable command with def, hand it an input, and get a value back with return.",
      steps: [
        {
          title: "Building the machine with def",
          body:
            "def starts a function: reusable work with a name. The header is def, then the name you choose, then brackets and a colon. The indented lines below are the body, the work the function does.",
          code: `def say_hello():\n    print("Hello!")`,
          why: "def creates a named block of work without running it yet.",
        },
        {
          title: "Nothing happens until you call it",
          body:
            "Writing a function does not run it. To run it you write its name followed by brackets. Save, then call it at the bottom, and the body runs at that moment.",
          code: `def say_hello():\n    print("Hello!")\n\nsay_hello()`,
          why: "The call by name with brackets is what actually runs the body.",
        },
        {
          title: "Plus joins text pieces",
          body:
            "The + sign glues two pieces of text into one. You must put any space you want inside the quotes yourself, because Python joins them exactly as written: \"Hello, \" ends with a space, so the result reads nicely.",
          code: `greeting = "Hello, " + "Djano"\nprint(greeting)`,
          why: "Plus with text means join, not add up.",
        },
        {
          title: "Handing the machine an input",
          body:
            "The brackets after the function name can hold inputs, called parameters. When you call greet(\"Djano\"), the parameter name holds Djano for that call, so the same function can greet anyone.",
          code: `def greet(name):\n    print("Hello, " + name)\n\ngreet("Djano")\ngreet("Buffy")`,
          why: "One function body, different inputs, different output.",
        },
        {
          title: "return hands the answer back",
          body:
            "print only says something on screen; the answer is gone afterwards. return sends the value back to the caller, so you can store it in a box, compare it, or print it. That is why a function that calculates something should use return.",
          code: `def double(n):\n    return n * 2\n\nresult = double(4)\nprint(result)`,
          why: "return gives a value back; print only displays one.",
        },
      ],
      checkQuestion:
        "Your function uses print(\"Hi\") inside instead of return \"Hi\". What is missing for the caller?",
      checkAnswer:
        "Nothing comes back to the caller. print only shows the text on screen, while return hands the value to the caller so it can be stored or reused.",
      takeaways: [
        "def builds a function, and it only runs when you call it.",
        "The brackets after the name hold inputs, called parameters.",
        "return sends a value back to the caller; print only displays it.",
        "Plus joins text, and include the spaces inside the quotes.",
      ],
      generatedBy: "Django Adventure course team",
    },
    language: "python",
    runnable: true,
    tests: [
      {
        name: "greet works",
        assertCode: `assert greet("Djano") == "Hello, Djano", "greet(name) should return the text Hello, then the name, with a space after the comma"`,
      },
      { name: "prints hello", expectContains: ["Hello, Djano"] },
    ],
    rubricForGemini: "Must define greet(name) returning Hello, + name and print call result.",
    hints: [
      "def greet(name):  Keep the colon at the end.",
      "Indent the next line: return \"Hello, \" + name",
      "Last line: print(greet(\"Djano\"))",
    ],
    xp: 40,
  },
  {
    id: 7,
    slug: "pip-market",
    title: "Pip Market and Backpack",
    topic: "pip and virtual environments",
    projectGoal: "Set up the real tools you will build DinoShop with",
    track: "python",
    world: "Python Playground",
    storyKid:
      "Welcome to Pip Market. pip installs Python packages the way a store sells supplies. venv is your school backpack: it keeps your project supplies separate. Django lives in this market.",
    mission: "No code runs here. In comments, write the two commands: (1) create a virtual environment, (2) install django.",
    analogy10yo: "venv is your own lunchbox. pip install is buying supplies from the shop.",
    exampleCode: `# make backpack:\n# python -m venv backpack\n# wear backpack (activate):\n# source backpack/bin/activate  (Windows: backpack\\Scripts\\activate)\n# buy django:\n# pip install django`,
    exampleWalkthrough: [
      "Command 1 creates a folder called backpack that will hold a private copy of the Python tools for this project.",
      "Command 2 activates that folder, so this terminal now works inside your project supplies instead of the shared ones.",
      "Command 3 is the same in Windows PowerShell, only the folder path is written differently.",
      "Command 4 uses pip, the package shop, to download Django into your active backpack.",
    ],
    syntaxPattern: `python -m venv <folder_name>\nsource <folder_name>/bin/activate\npip install <package_name>`,
    syntaxParts: [
      { token: "python -m venv", meaning: "Terminal command that creates a fresh virtual environment folder for one project. Not Python code, so no brackets or quotes." },
      { token: "<folder_name>", meaning: "The folder name you choose, like backpack or venv.", placeholder: true },
      { token: "source .../activate", meaning: "Switches this terminal into the environment. On Windows PowerShell it is <folder_name>\\Scripts\\activate instead." },
      { token: "pip install", meaning: "Downloads a package from the Python package shop into the active environment." },
      { token: "<package_name>", meaning: "The package to install, like django.", placeholder: true },
    ],
    starterCode: `# Write the 2 commands as comments:\n# 1) python -m venv ???\n# 2) pip install ???\n`,
    guidedLesson: {
      objective:
        "You will understand what a virtual environment is, why every project gets its own, and how pip puts Django inside it.",
      steps: [
        {
          title: "The terminal is a text conversation",
          body:
            "Outside Python you type commands straight into the terminal and press Enter. There are no brackets and no quotes, just a command plus its words. The terminal always answers, either with output or with an error you can read.",
          code: `# typed in the terminal, not in Python:\npython --version`,
          why: "You can always ask the terminal a quick question to check where you are.",
        },
        {
          title: "venv gives the project its own backpack",
          body:
            "If every project installed packages in the same place, two projects needing different versions would fight. python -m venv creates a private folder holding its own tool copy, one backpack per project.",
          code: `# creates a folder named backpack:\npython -m venv backpack`,
          why: "A virtual environment keeps each project's packages separate.",
        },
        {
          title: "Activate the backpack, then install Django",
          body:
            "Activating makes this terminal use the backpack from now on, so anything you install lands inside the project. pip is the package shop, and pip install django downloads Django into that backpack.",
          code: `# macOS or Linux:\nsource backpack/bin/activate\n\n# Windows PowerShell:\nbackpack\\Scripts\\activate\n\n# then, with the backpack active:\npip install django`,
          why: "Installing while a virtual environment is active keeps Django inside the project.",
        },
        {
          title: "How you know it worked",
          body:
            "Never guess. Ask Python to import Django and print its version. If you see a version number, the install landed in the right place, and your project is ready for the next chapter.",
          code: `python -c "import django; print(django.get_version())"`,
          why: "An import that works proves the package is installed and reachable.",
        },
      ],
      checkQuestion:
        "Why create a fresh virtual environment for each Django project instead of installing Django once for the whole computer?",
      checkAnswer:
        "Because each project gets its own set of packages, so one project upgrading Django cannot break another, and you always know exactly what a project needs.",
      takeaways: [
        "venv creates a private package folder for one project.",
        "Activate the environment before installing anything with pip.",
        "pip install django adds Django to the active environment.",
        "Check your work with python -c \"import django; print(django.get_version())\".",
      ],
      generatedBy: "Django Adventure course team",
    },
    language: "python",
    runnable: false,
    tests: [],
    rubricForGemini:
      "Check comments contain 'python -m venv' and 'pip install django'. Be lenient on venv name. Explain simply if wrong.",
    hints: [
      "Backpack command: python -m venv mybackpack",
      "Install command: pip install django",
      "Write both as comments starting with #",
    ],
    xp: 20,
    boss: true,
  },
  {
    id: 8,
    slug: "django-mvt-castle",
    title: "Django Castle: MVT Magic",
    topic: "First Django view (HttpResponse)",
    projectGoal: "Serve your shop's first page from a Django view",
    track: "django-basics",
    world: "Django Village",
    storyKid:
      "You enter Django Castle. It has 3 helpers: Model remembers data, View prepares the answer, Template makes the page look good. When a visitor opens a URL, all three work as a team.",
    mission: "Make your first view: a function home(request) that returns HttpResponse with Hello, Castle!",
    analogy10yo: "A URL is a street address. A view is the chef. A template is the plate. A model is the notebook.",
    exampleCode: `from django.http import HttpResponse\n\ndef home(request):\n    return HttpResponse("Hello, Castle!")\n\n# urls.py connects address to view:\n# path("", home)`,
    exampleWalkthrough: [
      "Line 1: the import line brings Django's response tool into your file so you can use the name HttpResponse.",
      "Line 3: def home(request): defines a view, which is a normal Python function with one special rule, it always receives the request as its first input.",
      "Line 4 is indented, so it is the body of the view. return ends the function and sends the answer back to the visitor.",
      "HttpResponse(\"Hello, Castle!\") builds the page text. Without the return, the visitor would get nothing.",
      "Line 6 is a comment showing the URL line that connects an address to this view, which is the next chapter.",
    ],
    syntaxPattern: `def <view_name>(request):\n    return HttpResponse("<page text>")`,
    syntaxParts: [
      { token: "def <view_name>(request):", meaning: "A view is a normal Python function. Its first input is always the request, and Django passes it automatically. Name views after the page: home, about, products.", placeholder: true },
      { token: "from django.http import HttpResponse", meaning: "Brings Django's response tool into the file. Without this import line the name HttpResponse does not exist." },
      { token: "    return HttpResponse(...)", meaning: "The indented body must return a response. HttpResponse wraps your text as a real web page for the browser." },
      { token: '"<page text>"', meaning: "What the visitor sees on the page, in quotes.", placeholder: true },
    ],
    starterCode: `from django.http import HttpResponse\n\n# Define home(request) returning Hello, Castle!\n`,
    guidedLesson: {
      objective:
        "You will understand what a view is, why it takes request, and how it sends an answer back to the visitor.",
      steps: [
        {
          title: "A visit is a request and a response",
          body:
            "When someone opens your page the browser asks Django for it: that question is the request. Django must answer with something to show: that answer is the response. Every Django view exists to turn one into the other.",
          code: `# request comes in, response goes out\n# browser  --->  Django view  --->  page`,
          why: "Thinking request in, response out keeps every Django file easy to place.",
        },
        {
          title: "A view is a Python function",
          body:
            "You already know how to define a function with def and a colon. A view is exactly that, with one rule: its first input is always the request, so we usually name it request.",
          code: `def home(request):\n    # the work goes here, indented 4 spaces`,
          why: "Django will always pass the request as the first input when it calls your view.",
        },
        {
          title: "HttpResponse is the answer you send",
          body:
            "Django does not print the page, it returns it. HttpResponse wraps your text as a real web response, so the browser can display it. The import line at the top is what makes that name available in your file.",
          code: `from django.http import HttpResponse\n\ndef home(request):\n    return HttpResponse("Hello, Castle!")`,
          why: "A view must return a response, not print it, because the browser is waiting for an answer.",
        },
        {
          title: "The URL line connects an address to a view",
          body:
            "A view alone is invisible until an address points at it. The path line says: when a visitor asks for this address, call that view. In the next chapter you will build the full map of addresses.",
          code: `# in urls.py:\n# path("", home)   means the home address / uses the home view`,
          why: "Django matches the address the browser asked for, then calls the matching view.",
        },
      ],
      checkQuestion:
        "Why must a view return HttpResponse instead of just print(\"Hello, Castle!\")?",
      checkAnswer:
        "Because the browser needs a response object sent back to it. Printing only writes into the server's own output, so the visitor would see nothing.",
      takeaways: [
        "A view receives the request and must return a response.",
        "Views are plain functions whose first input is request.",
        "HttpResponse is imported from django.http and wraps the page text.",
        "A URL pattern is what connects an address to a view.",
      ],
      generatedBy: "Django Adventure course team",
    },
    language: "python",
    runnable: false,
    tests: [],
    rubricForGemini:
      "Must import HttpResponse, define def home(request): returning HttpResponse('Hello, Castle!'). Check function name home, param request, return statement.",
    hints: [
      "def home(request):",
      "    return HttpResponse(\"Hello, Castle!\")",
      "The import line is already given.",
    ],
    xp: 40,
  },
  {
    id: 9,
    slug: "url-treasure-map",
    title: "URL Treasure Map",
    topic: "URL routing (urls.py and path)",
    projectGoal: "Give your shop pages real addresses: / and /about/",
    track: "django-basics",
    world: "Django Village",
    storyKid:
      "Every page needs a treasure map (urls.py). It says: when a visitor goes HERE, call THAT view. Let us map the castle gate.",
    mission: "In urls.py style, map path with empty string to home and path about/ to about. Import path plus both views.",
    analogy10yo: "urls.py is a school timetable. Morning means maths class. Empty path means home view. about/ means about view.",
    exampleCode: `from django.urls import path\nfrom .views import home, about\n\nurlpatterns = [\n    path("", home),\n    path("about/", about),\n]`,
    exampleWalkthrough: [
      "Line 1: Django's URL tool is called path, so it is imported first.",
      "Line 2: the two views live in the same app, so we import them with a dot: .views means the views file next to this one.",
      "Line 4: urlpatterns is a normal Python list. Django reads it from top to bottom and uses the first address that matches.",
      "Line 5: path(\"\", home) pairs the empty address, the site home page, with the home view.",
      "Line 6: path(\"about/\", about) pairs the address about/ with the about view. The trailing slash matters, because that is the address the browser will ask for.",
    ],
    syntaxPattern: `from .views import <view_a>, <view_b>\n\nurlpatterns = [\n    path("<address>", <view>),\n]`,
    syntaxParts: [
      { token: "from django.urls import path", meaning: "The path tool lives in django.urls, so it must be imported before use." },
      { token: "from .views import <view_a>, <view_b>", meaning: "Imports your own views from the views file next to this one. The dot means: same folder.", placeholder: true },
      { token: "urlpatterns = [ ]", meaning: "A plain Python list Django reads top to bottom. The first address that matches wins, so order matters." },
      { token: 'path("<address>", <view>)', meaning: "One entry: the address text first, then the view name with no brackets. The empty address \"\" is the home page; longer addresses end with a slash like \"about/\".", placeholder: true },
    ],
    starterCode: `from django.urls import path\n# Import home and about, then make the urlpatterns list\n`,
    guidedLesson: {
      objective:
        "You will understand that urls.py is an address book: a list of address and view pairs Django reads from top to bottom.",
      steps: [
        {
          title: "urls.py is the address book",
          body:
            "Every page needs an address, and someone has to write down which view answers which address. That is the whole job of urls.py. When a visitor arrives, Django opens the address book and looks for the matching line.",
          code: `# visitor asks for /about/\n# Django checks the address book\n# and calls the view listed for it`,
          why: "No address book entry means Django cannot find anything and returns a 404.",
        },
        {
          title: "urlpatterns is just a list",
          body:
            "You already know lists from Python. urlpatterns is a list whose items are address entries, written one per line inside square brackets. Django reads them from top to bottom and stops at the first match.",
          code: `urlpatterns = [\n    path("", home),\n]`,
          why: "Order matters, because the first matching address wins.",
        },
        {
          title: "path(address, view) pairs them up",
          body:
            "Each entry has two pieces: the address written as text, and the view to call. An empty address \"\" is the home page, the plain site address. Anything longer is written with a trailing slash, like \"about/\".",
          code: `urlpatterns = [\n    path("", home),\n    path("about/", about),\n]`,
          why: "The first argument is the address text, the second is the view name without brackets.",
        },
        {
          title: "Import every name you use",
          body:
            "path comes from django.urls, and your views come from your own app, imported with a dot: from .views import home, about. Names that are used but never imported raise a NameError, exactly like any other Python file.",
          code: `from django.urls import path\nfrom .views import home, about\n\nurlpatterns = [\n    path("", home),\n    path("about/", about),\n]`,
          why: "Everything used in a file must be defined there or imported into it.",
        },
      ],
      checkQuestion:
        "What is the difference between path(\"\", home) and path(\"about/\", about)?",
      checkAnswer:
        "path(\"\", home) answers the plain site address, the home page, while path(\"about/\", about) answers the address about/ with the about view.",
      takeaways: [
        "urls.py maps addresses to views.",
        "urlpatterns is a list, and the first matching address wins.",
        "path(address, view) takes the address text first, then the view.",
        "Import path and every view you mention.",
      ],
      generatedBy: "Django Adventure course team",
    },
    language: "python",
    runnable: false,
    tests: [],
    rubricForGemini:
      "Must have from django.urls import path, from .views import home, about, and urlpatterns list with path('', home) and path('about/', about). Be lenient on quotes/trailing comma.",
    hints: [
      "Import views: from .views import home, about",
      "Make list: urlpatterns = [",
      "Inside: path(\"\", home), plus path(\"about/\", about),",
    ],
    xp: 40,
    boss: true,
  },
];

/**
 * THE SYLLABUS (levels 10-100)
 * ============================
 * Skeletons only: when a learner visits a chapter, the server asks Gemini
 * (Guided Learning pedagogy) to fill in the full lesson, story, starter code
 * and mission, then caches the result on disk so each chapter generates
 * exactly once.
 *
 * Each entry is the REAL topic the chapter teaches. `title` keeps a light
 * adventure flavor, but the map, search, and generator all lead with
 * `topic` so learners always see exactly what they are learning. Django
 * chapters build one running project (DinoShop) piece by piece; `goal`
 * says which piece this chapter adds.
 */
interface LevelOutline {
  id: number;
  title: string;
  /** The actual syllabus topic shown on the map and taught by Gemini. */
  topic: string;
  /** Full technical scope handed to Gemini: exactly what to teach. */
  concept: string;
  /** What this chapter adds to the running DinoShop project. */
  goal: string;
  track: Level["track"];
  world: string;
  boss?: boolean;
}

const OUTLINES: LevelOutline[] = [
  // ---------------- PYTHON FOUNDATIONS II (10-19) ----------------
  { id: 10, title: "Class Pets: OOP", topic: "Classes and objects", concept: "classes and objects: class definition, __init__, self, attributes, creating instances, simple methods", goal: "Model a Product as a Python class with name and price", track: "python", world: "Python Playground", boss: true },
  { id: 11, title: "Templates: Pretty Plates", topic: "Django templates", concept: "Django templates: rendering a template from a view, template variables {{ }}, tags {% %}, passing context data", goal: "Turn your shop home page into a real HTML template showing products", track: "django-basics", world: "Django Village" },
  { id: 12, title: "Template Inheritance", topic: "Template inheritance", concept: "template inheritance with {% extends %} and {% block %}, base.html layout, reusing headers and footers", goal: "Give every DinoShop page one shared header and footer", track: "django-basics", world: "Django Village" },
  { id: 13, title: "Static Files", topic: "Static files and CSS", concept: "Django static files: STATIC_URL, {% static %} tag, linking CSS and images, collectbasics of the static folder", goal: "Style the DinoShop pages with your own CSS", track: "django-basics", world: "Django Village" },
  { id: 14, title: "Model Librarian", topic: "Django models", concept: "Django models: models.Model subclass, fields (CharField, IntegerField, FloatField), str method, the objects manager", goal: "Create the Product model so DinoShop can remember products", track: "models", world: "Model Mountain" },
  { id: 15, title: "Migrations Time Machine", topic: "Migrations", concept: "migrations: makemigrations and migrate, what migration files are, checking migration status, how Django updates the database schema", goal: "Create the products table in the DinoShop database", track: "models", world: "Model Mountain", boss: true },
  { id: 16, title: "Admin Control Room", topic: "Django admin", concept: "the Django admin: creating a superuser, registering models in admin.py, adding and editing records in the admin UI", goal: "Manage DinoShop products from the admin panel", track: "models", world: "Model Mountain" },
  { id: 17, title: "ORM Treasure Hunt", topic: "The ORM: query the database", concept: "the Django ORM: Product.objects.all(), .get(), .filter(), .create(), field lookups like price__gt, ordering", goal: "Show real products from the database on your shop page", track: "models", world: "Model Mountain" },
  { id: 18, title: "Detail Pages and URLs", topic: "Dynamic URLs and detail pages", concept: "path converters like <int:product_id>, dynamic URL patterns, views that take URL arguments, get_object_or_404", goal: "Build a product detail page /products/5/ for every DinoShop item", track: "django-basics", world: "Django Village" },
  { id: 19, title: "Forms: Magic Forms", topic: "Django forms", concept: "Django Form classes: form fields, widgets, validating submitted data with is_valid(), cleaned_data, rendering forms in templates", goal: "Let visitors search and add products with a form", track: "templates-auth", world: "Template Town" },

  // ---------------- REAL APP SKILLS (20-29) ----------------
  { id: 20, title: "Login Gate", topic: "User accounts: register and login", concept: "Django authentication: User model, creating users, login, logout, authenticate, session cookies, LoginRequired basics", goal: "Give DinoShop real user accounts: sign up, sign in, sign out", track: "templates-auth", world: "Template Town", boss: true },
  { id: 21, title: "CBV Robots", topic: "Class-based views", concept: "class-based views: ListView and DetailView, when CBVs beat function views, template_name and context_object_name", goal: "Rebuild the product list and detail pages with ListView and DetailView", track: "advanced", world: "Advanced Forest", boss: true },
  { id: 22, title: "Middleware Guards", topic: "Middleware", concept: "middleware and the request pipeline: what middleware is, request/response flow, MIDDLEWARE setting order, writing a tiny custom middleware", goal: "Add a middleware that logs every DinoShop visit", track: "advanced", world: "Advanced Forest" },
  { id: 23, title: "URL Namespaces", topic: "URL names and namespaces", concept: "URL names, {% url %} template tag, app_name namespaces, reversing URLs in views with reverse(), why hard-coded links break", goal: "Replace hard-coded DinoShop links with named URLs", track: "advanced", world: "Advanced Forest" },
  { id: 24, title: "Context Processors", topic: "Context processors", concept: "context processors: injecting data into every template, the context_processors setting, building a cart-count or site-name processor", goal: "Show the cart count on every DinoShop page automatically", track: "advanced", world: "Advanced Forest" },
  { id: 25, title: "Signals: Smoke Signals", topic: "Signals", concept: "Django signals: post_save and pre_save receivers, connecting signals, common uses like creating user profiles automatically", goal: "Auto-create a Profile for every new DinoShop customer", track: "advanced", world: "Advanced Forest" },
  { id: 26, title: "Testing School", topic: "Automated tests", concept: "Django testing: TestCase, test databases, testing views and models, the client test tool, running tests", goal: "Write tests that prove DinoShop pages and models work", track: "advanced", world: "Advanced Forest" },
  { id: 27, title: "File Uploads", topic: "File and image uploads", concept: "file uploads: FileField and ImageField, enctype multipart forms, MEDIA_ROOT and MEDIA_URL, serving uploaded files in development", goal: "Let sellers upload product photos to DinoShop", track: "advanced", world: "Advanced Forest" },
  { id: 28, title: "Messages and Pagination", topic: "Flash messages and pagination", concept: "the messages framework for one-time notifications and Paginator for splitting long lists across pages", goal: "Add success flash messages and page the product list 10 per page", track: "advanced", world: "Advanced Forest" },
  { id: 29, title: "Session Cart", topic: "Sessions and a shopping cart", concept: "sessions: request.session, storing cart data per visitor, session-based carts, cookies basics", goal: "Build the DinoShop cart that remembers items per user", track: "templates-auth", world: "Template Town", boss: true },

  // ---------------- DRF: BUILD A REAL API (30-39) ----------------
  { id: 30, title: "DRF Rocket Launch", topic: "Django REST Framework setup", concept: "Django REST Framework: installing djangorestframework, REST ideas (resources, JSON, HTTP verbs), first APIView returning JSON", goal: "Expose DinoShop products as JSON at /api/products/", track: "drf", world: "DRF Rocket" },
  { id: 31, title: "Serializers", topic: "Serializers", concept: "DRF serializers: Serializer and ModelSerializer, converting models to JSON and back, field validation, create and update", goal: "Serialize DinoShop products and accept new ones via API", track: "drf", world: "DRF Rocket" },
  { id: 32, title: "APIView Jets", topic: "APIViews", concept: "DRF APIView: get, post, put, patch, delete handlers, request.data, Response objects, status codes", goal: "Build full create/read/update/delete for products by hand", track: "drf", world: "DRF Rocket" },
  { id: 33, title: "ViewSet Squad", topic: "ViewSets and routers", concept: "DRF ViewSets and Routers: ModelViewSet, DefaultRouter, how routers generate URLs, when ViewSets beat APIViews", goal: "Replace hand-written API views with one ModelViewSet", track: "drf", world: "DRF Rocket" },
  { id: 34, title: "Permissions Shield", topic: "API permissions", concept: "DRF permissions: IsAuthenticated, IsAdminUser, custom permission classes, object-level permissions", goal: "Only logged-in sellers can edit products; anyone can browse", track: "drf", world: "DRF Rocket" },
  { id: 35, title: "Token Badges", topic: "API authentication (tokens and JWT)", concept: "API authentication: TokenAuthentication, JWT with djangorestframework-simplejwt, obtaining tokens, sending Authorization headers", goal: "Let the API recognize logged-in users with tokens", track: "drf", world: "DRF Rocket", boss: true },
  { id: 36, title: "Filtering Bazaar", topic: "Filtering and searching the API", concept: "query param filtering with django-filter, SearchFilter and OrderingFilter backends, custom filtering in get_queryset", goal: "Let shoppers filter products by price, name, and category", track: "drf", world: "DRF Rocket" },
  { id: 37, title: "Pagination conveyer", topic: "API pagination", concept: "DRF pagination: PageNumberPagination, LimitOffsetPagination, custom page size, paginated responses", goal: "Page the products API like a real web service", track: "drf", world: "DRF Rocket" },
  { id: 38, title: "Throttling Gates", topic: "Rate limiting (throttling)", concept: "DRF throttling: AnonRateThrottle, UserRateThrottle, scoped throttles, protecting expensive endpoints", goal: "Stop bots from hammering your shop API", track: "drf", world: "DRF Rocket" },
  { id: 39, title: "Versioning Vault", topic: "API versioning", concept: "API versioning strategies: URL versioning like /api/v1/, Accept-header versioning, deprecating old versions", goal: "Ship /api/v1/ so old apps keep working while you improve", track: "drf", world: "DRF Rocket", boss: true },

  // ---------------- PRO APP PATTERNS (40-49) ----------------
  { id: 40, title: "Related Models", topic: "Foreign keys and relations", concept: "model relationships: ForeignKey, OneToOneField, ManyToManyField, related_name, nested data, on_delete behavior", goal: "Add Category and Order models linked to Product", track: "models", world: "Model Mountain" },
  { id: 41, title: "Model Methods and Properties", topic: "Custom model methods", concept: "custom model methods and properties, computed fields, default methods, Meta options like ordering, clean validation", goal: "Give Product an is_in_stock method and discounted price", track: "models", world: "Model Mountain" },
  { id: 42, title: "Querysets Power Moves", topic: "Advanced queries", concept: "advanced ORM: annotate and aggregate, Q objects for OR queries, F expressions, select_related and prefetch_related, values and values_list", goal: "Build bestseller lists and category counts efficiently", track: "models", world: "Model Mountain" },
  { id: 43, title: "Nested Serializers", topic: "Nested and related serializers", concept: "DRF nested serializers, related fields (PrimaryKeyRelatedField, StringRelatedField), SerializerMethodField, read_only and write_only fields", goal: "Return each product with its category and reviews in one API call", track: "drf", world: "DRF Rocket" },
  { id: 44, title: "Custom Validators", topic: "Custom validation", concept: "field-level validate_ methods, object-level validate(), Django validators, raising ValidationError with friendly messages", goal: "Reject bad product data with clear error messages", track: "drf", world: "DRF Rocket" },
  { id: 45, title: "Actions and Custom Endpoints", topic: "Custom ViewSet actions", concept: "@action decorator on ViewSets, extra routes, url_path and url_name, detail vs list actions", goal: "Add POST /api/products/1/review/ to rate a product", track: "drf", world: "DRF Rocket" },
  { id: 46, title: "Echo Valley: Signals at Work", topic: "Signals in the real world", concept: "practical signals: post_save to sync related models, pre_delete cleanup, avoiding signal overuse, when plain methods are better", goal: "Recalculate the shop rating whenever a review is saved", track: "advanced", world: "Advanced Forest" },
  { id: 47, title: "Testing the API", topic: "API tests", concept: "testing DRF: APIClient, APITestCase, asserting JSON responses, authenticating test requests, testing permissions", goal: "Prove the DinoShop API works with automated tests", track: "advanced", world: "Advanced Forest" },
  { id: 48, title: "Celery Workers", topic: "Background tasks with Celery", concept: "background work: Celery and Redis, task queues, @shared_task, running workers, common uses like sending email after order", goal: "Send the order confirmation email in the background", track: "advanced", world: "Advanced Forest" },
  { id: 49, title: "Caching Charm", topic: "Caching", concept: "caching: the Django cache framework, per-view caching, low-level cache.get and set, cache invalidation basics, Redis as cache backend", goal: "Make the bestseller page load instantly with cache", track: "deploy", world: "Deploy Sky", boss: true },

  // ---------------- SHIP IT: PRODUCTION (50-59) ----------------
  { id: 50, title: "Settings Split", topic: "Splitting dev and production settings", concept: "settings organization: splitting settings into base/dev/prod modules, environment-driven config, DEBUG=False dangers", goal: "Prepare DinoShop settings for real deployment", track: "deploy", world: "Deploy Sky" },
  { id: 51, title: "Env Vault Keys", topic: "Environment variables and secrets", concept: "environment variables and secrets: python-dotenv, os.environ, keeping SECRET_KEY and DB creds out of git, .env files", goal: "Move all DinoShop secrets out of the code", track: "deploy", world: "Deploy Sky" },
  { id: 52, title: "Postgres Swamp Crossing", topic: "PostgreSQL in production", concept: "swapping SQLite for Postgres: psycopg, DATABASE_URL, creating the production database, migrating data, why Postgres for real apps", goal: "Run DinoShop on a real PostgreSQL database", track: "deploy", world: "Deploy Sky", boss: true },
  { id: 53, title: "Gunicorn Steed", topic: "WSGI servers and Gunicorn", concept: "WSGI servers: why runserver is not for production, Gunicorn workers, bind address, process management", goal: "Serve DinoShop with Gunicorn instead of runserver", track: "deploy", world: "Deploy Sky" },
  { id: 54, title: "WhiteNoise Saddle", topic: "Serving static files in production", concept: "serving static files with WhiteNoise: whitenoise middleware, collectstatic, compressed static files, media files strategy", goal: "Ship CSS and images fast with WhiteNoise", track: "deploy", world: "Deploy Sky" },
  { id: 55, title: "HTTPS Shield", topic: "HTTPS and security settings", concept: "TLS, HTTPS and security: SECURE_SSL_REDIRECT, HSTS, secure cookies, CSRF protection, common Django security settings checklist", goal: "Lock down DinoShop with HTTPS and security headers", track: "deploy", world: "Deploy Sky" },
  { id: 56, title: "Docker Drum", topic: "Docker for Django", concept: "containerizing Django with Docker: Dockerfile, docker-compose for web plus db, volumes, building and running the container", goal: "Package DinoShop so it runs anywhere with one command", track: "deploy", world: "Deploy Sky" },
  { id: 57, title: "Deploy Balloon", topic: "Deploying to the cloud", concept: "deploying to a PaaS from zero: preparing requirements, Procfile, release commands, environment variables on the host, first live deploy", goal: "Put real DinoShop on the internet with a public URL", track: "deploy", world: "Deploy Sky" },
  { id: 58, title: "Logging and Monitoring", topic: "Logging and error tracking", concept: "LOGGING setting, log levels and handlers, structured logs, integrating an error tracker like Sentry, reading production errors", goal: "Know the moment DinoShop breaks in production", track: "deploy", world: "Deploy Sky" },
  { id: 59, title: "Migrations in Production", topic: "Production data and migrations", concept: "running migrations safely in production, data migrations, backing up before schema changes, zero-downtime thinking", goal: "Change the live database without breaking the shop", track: "deploy", world: "Deploy Sky", boss: true },

  // ---------------- FRONTEND + POLISH (60-69) ----------------
  { id: 60, title: "Template Forge: Custom Tags", topic: "Templates deep dive", concept: "advanced templates: custom template tags and filters, inclusion tags, template context tricks, organizing template folders", goal: "Build a reusable product-card tag for DinoShop pages", track: "django-basics", world: "Django Village" },
  { id: 61, title: "Forms: ModelForms", topic: "ModelForms", concept: "ModelForm: generating forms from models, fields and exclude, saving with form.save(), widgets and customizing fields", goal: "Build a clean product-edit form in minutes", track: "templates-auth", world: "Template Town" },
  { id: 62, title: "Formsets and Inline Forms", topic: "Formsets", concept: "formsets and inline formsets: editing many forms at once, formset validation, managing_form, use cases like bulk product edit", goal: "Edit many product prices on one page", track: "templates-auth", world: "Template Town" },
  { id: 63, title: "Classy Forms Workflow", topic: "Create-update-delete views", concept: "CreateView, UpdateView, DeleteView, success_url, login-required CBVs, form_valid hook", goal: "Give sellers full add/edit/delete screens for products", track: "templates-auth", world: "Template Town", boss: true },
  { id: 64, title: "Emails from Django", topic: "Sending email", concept: "sending email: EmailMessage and send_mail, console backend for dev, SMTP settings, templates for HTML email", goal: "Email DinoShop order receipts", track: "advanced", world: "Advanced Forest" },
  { id: 65, title: "Custom User Model", topic: "Custom user model", concept: "custom user models: AbstractUser, AUTH_USER_MODEL, why start custom early, adding fields like phone, migrating user changes", goal: "Give DinoShop users phone numbers and avatars", track: "models", world: "Model Mountain" },
  { id: 66, title: "Social Login", topic: "Social authentication", concept: "social auth with django-allauth: OAuth login buttons, configuring providers, redirect flows", goal: "Let shoppers sign in with Google in one click", track: "templates-auth", world: "Template Town" },
  { id: 67, title: "Payments Basics", topic: "Taking payments", concept: "payment basics with Stripe: checkout session flow, test keys, webhooks concept, marking orders paid", goal: "Accept a test payment for a DinoShop order", track: "advanced", world: "Advanced Forest", boss: true },
  { id: 68, title: "API Views for the Browser", topic: "Consuming your API from the frontend", concept: "calling your own DRF API from JavaScript: fetch and axios, JSON, CORS with django-cors-headers, rendering API data on a page", goal: "Make the shop page load products live from your API", track: "drf", world: "DRF Rocket" },
  { id: 69, title: "WebSockets Peek", topic: "Realtime with Django Channels", concept: "Django Channels and WebSockets: consumers, ASGI, broadcasting events, simple live notification", goal: "Ping the shopper when their order status changes", track: "advanced", world: "Advanced Forest" },

  // ---------------- ARCHITECTURE + SCALE (70-79) ----------------
  { id: 70, title: "Project Anatomy", topic: "Structuring a big Django project", concept: "project layout at scale: apps per domain, fat models skinny views, services layer, where business logic lives, settings organization", goal: "Refactor DinoShop into clean, growable apps", track: "advanced", world: "Advanced Forest" },
  { id: 71, title: "Reusable Apps", topic: "Reusable apps", concept: "building reusable Django apps: app config, packaging, distributing internally, when to extract an app", goal: "Extract the reviews feature into its own app", track: "advanced", world: "Advanced Forest" },
  { id: 72, title: "API Design Principles", topic: "Designing good APIs", concept: "REST design principles: resource naming, status code choices, idempotency, HATEOAS awareness, consistent error formats", goal: "Redesign the DinoShop API like a pro", track: "drf", world: "DRF Rocket" },
  { id: 73, title: "Schema and Docs", topic: "API documentation", concept: "API documentation with drf-spectacular: OpenAPI schema, Swagger UI, documenting endpoints, versioned docs", goal: "Give DinoShop an auto-generated Swagger page", track: "drf", world: "DRF Rocket" },
  { id: 74, title: "Database Indexes", topic: "Database performance", concept: "database performance: db_index and Meta.indexes, select_related vs prefetch_related, N+1 queries, django-debug-toolbar", goal: "Make the product list query count drop from 100 to 2", track: "models", world: "Model Mountain", boss: true },
  { id: 75, title: "Guard Towers: Custom Middleware", topic: "Custom middleware mastery", concept: "writing production middleware: process_view hooks, exception middleware, ordering, real examples like request timing", goal: "Add request timing and error-catching middleware", track: "advanced", world: "Advanced Forest" },
  { id: 76, title: "Signals: Smoke Signals", topic: "Signals vs services", concept: "architecting side effects: signals vs explicit service calls, transaction.on_commit, avoiding hidden coupling", goal: "Make order side effects explicit and testable", track: "advanced", world: "Advanced Forest" },
  { id: 77, title: "Background Jobs Deep Dive", topic: "Celery in production", concept: "Celery in production: task retry, eta and scheduling with celery beat, monitoring workers, idempotent tasks", goal: "Schedule nightly bestseller recalculation", track: "advanced", world: "Advanced Forest" },
  { id: 78, title: "Feature Flags and Settings", topic: "Feature flags and config", concept: "feature flags: simple settings-based flags, environment toggles, gradual rollouts, django-constance idea", goal: "Turn new DinoShop features on for some users only", track: "advanced", world: "Advanced Forest" },
  { id: 79, title: "Security Deep Dive", topic: "Security hardening", concept: "deep security: SQL injection and the ORM, XSS and template autoescaping, clickjacking middleware, password hashing, OWASP basics for Django", goal: "Pass a mini security audit of DinoShop", track: "advanced", world: "Advanced Forest", boss: true },

  // ---------------- CAPSTONE SPRINT: BUILD THE BIG APP (80-100) ----------------
  { id: 80, title: "Capstone Kickoff", topic: "Capstone: plan your own app", concept: "planning a real application: choosing features, modeling data on paper, listing URLs and API endpoints, milestone plan", goal: "Design YOUR own big app like a real developer", track: "capstone", world: "Boss: Ship It" },
  { id: 81, title: "Capstone Models", topic: "Capstone: build the data layer", concept: "turning the plan into models: fields, relations, migrations, admin registration for every model", goal: "Create every database model your app needs", track: "capstone", world: "Boss: Ship It" },
  { id: 82, title: "Capstone Pages", topic: "Capstone: build the pages", concept: "building the user-facing pages: templates, views, URLs, forms, authentication wiring", goal: "Build every page of your app end to end", track: "capstone", world: "Boss: Ship It" },
  { id: 83, title: "Capstone API", topic: "Capstone: build the API", concept: "building the DRF API: serializers, viewsets, routers, permissions, filtering for your own app", goal: "Expose your app data through a real API", track: "capstone", world: "Boss: Ship It" },
  { id: 84, title: "Capstone Tests", topic: "Capstone: test your app", concept: "writing a test suite for your app: model tests, view tests, API tests, edge cases", goal: "Cover your app with tests that catch bugs", track: "capstone", world: "Boss: Ship It", boss: true },
  { id: 85, title: "Capstone Deploy", topic: "Capstone: deploy your app", concept: "deploying your own app: production settings, database, static files, WSGI server, live URL", goal: "Put YOUR app on the internet", track: "capstone", world: "Boss: Ship It" },
  { id: 86, title: "Capstone Polish", topic: "Capstone: polish and UX", concept: "polish: loading states, empty states, error pages, mobile layout, accessibility basics", goal: "Make your app feel finished, not a demo", track: "capstone", world: "Boss: Ship It" },
  { id: 87, title: "Reading Real Projects", topic: "Reading other people's code", concept: "reading real Django projects: tracing a request through urls to views to templates, reading open-source code, debugging techniques", goal: "Navigate a big unknown codebase without getting lost", track: "capstone", world: "Boss: Ship It" },
  { id: 88, title: "Debugging Dojo", topic: "Debugging like a pro", concept: "systematic debugging: reading tracebacks, pdb and breakpoints, django-debug-toolbar, reproducing bugs, rubber duck method", goal: "Hunt down and fix a planted bug in minutes", track: "capstone", world: "Boss: Ship It" },
  { id: 89, title: "Git and Teamwork", topic: "Git workflow for teams", concept: "git for real work: branches, pull requests, code review etiquette, .gitignore, resolving merge conflicts calmly", goal: "Ship a feature branch like a teammate would", track: "capstone", world: "Boss: Ship It", boss: true },
  { id: 90, title: "Django Internals Peek", topic: "How Django works inside", concept: "Django internals: the request-response cycle under the hood, how the ORM builds SQL, WSGI and ASGI apps, autoloading and app registry", goal: "Explain what Django does between request and response", track: "capstone", world: "Boss: Ship It" },
  { id: 91, title: "Async Django", topic: "Async Django", concept: "async views and middleware, async ORM basics, when async helps, async to sync bridges", goal: "Speed up a slow page with async views", track: "capstone", world: "Boss: Ship It" },
  { id: 92, title: "GraphQL Peek", topic: "GraphQL with Django", concept: "GraphQL basics with graphene-django: schema, queries, resolvers, when GraphQL beats REST", goal: "Query DinoShop data with one flexible GraphQL endpoint", track: "capstone", world: "Boss: Ship It" },
  { id: 93, title: "Search with Postgres", topic: "Full-text search", concept: "full-text search with Postgres: SearchVector, SearchQuery, ranking results, simple search views", goal: "Give DinoShop instant product search", track: "capstone", world: "Boss: Ship It" },
  { id: 94, title: "Data Dump and Import", topic: "Data import and management commands", concept: "custom management commands, fixtures, loaddata and dumpdata, importing CSV data into models", goal: "Import 1000 products from CSV with one command", track: "capstone", world: "Boss: Ship It" },
  { id: 95, title: "Performance Clinic", topic: "Making pages fast", concept: "performance: measuring slow views, query optimization, caching strategies, lazy loading, frontend asset tips", goal: "Cut your slowest page from seconds to milliseconds", track: "capstone", world: "Boss: Ship It" },
  { id: 96, title: "Interview Ready", topic: "Django interview questions", concept: "the questions interviewers ask: select_related vs prefetch_related, N+1, signals, middleware, transactions, testing strategy, clear answers", goal: "Answer the classic Django interview questions with confidence", track: "capstone", world: "Boss: Ship It" },
  { id: 97, title: "Portfolio Project Page", topic: "Presenting your project", concept: "presenting a project: README that sells, screenshots, architecture diagram, live demo link, code walkthrough", goal: "Write a README that makes recruiters click", track: "capstone", world: "Boss: Ship It" },
  { id: 98, title: "Keep Growing Roadmap", topic: "What to learn after this course", concept: "the road after Django: Celery mastery, Kubernetes peek, learning new frameworks fast, contributing to open source, staying current", goal: "Leave with a personal growth plan", track: "capstone", world: "Boss: Ship It" },
  { id: 99, title: "Final Boss: Ship Your App", topic: "Final review: the whole journey", concept: "capstone: build and deploy a real Django app end to end, reviewing every major topic from variables to deployment", goal: "Review everything from Level 0 to 99 in one epic quest", track: "capstone", world: "Boss: Ship It", boss: true },
  { id: 100, title: "Grand Finale: You Are a Django Developer", topic: "Graduation: build anything", concept: "graduation: you can now build a complete Django + DRF application yourself; final challenge to plan, build and ship a brand new idea solo", goal: "Prove it: plan, build and ship one new app, all by yourself", track: "capstone", world: "Boss: Ship It", boss: true },
];

function outlineToLevel(o: LevelOutline): Level {
  return {
    id: o.id,
    slug: `level-${o.id}`,
    title: o.title,
    topic: o.topic,
    projectGoal: o.goal,
    track: o.track,
    world: o.world,
    storyKid: `A new chapter of the adventure. Djano is preparing this quest with Gemini Guided Learning.`,
    mission: `Learn and practice: ${o.topic}.`,
    analogy10yo: "Generating this chapter with Gemini Guided Learning. Open it to forge the lesson.",
    exampleCode: `# Chapter ${o.id}: ${o.topic}\n# Concept: ${o.concept}\n# Visit this page once and Djano forges the full lesson with Gemini.`,
    starterCode: `# Chapter ${o.id}: ${o.topic}\n# Press FORGE LESSON to let Gemini Guided Learning build this chapter.\n`,
    language: "python",
    runnable: false,
    tests: [],
    rubricForGemini: `Level ${o.id} outline. Accept any reasonable attempt and encourage.`,
    hints: [
      "Press FORGE LESSON to generate this chapter with Gemini.",
      "The generated lesson uses Guided Learning: small steps, a check question, then the mission.",
      "Come back after generating: your progress stays saved.",
    ],
    xp: 40,
    boss: o.boss,
    preview: true,
    concept: o.concept,
  };
}

export const ALL_LEVELS: Level[] = [
  ...LEVELS_0_9,
  ...OUTLINES.map(outlineToLevel),
];

export function getLevel(id: number): Level | undefined {
  return ALL_LEVELS.find((l) => l.id === id);
}
