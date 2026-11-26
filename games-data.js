// Question and card data for the lesson-linked games.
window.LEARNSPHERE_QUIZZES = {
  fractions: [
    { question: 'In the fraction 3/4, what does the bottom number tell us?', options: ['How many parts are selected', 'How many equal parts make the whole', 'How many wholes there are', 'The size of the whole'], answer: 'How many equal parts make the whole', explanation: 'The denominator is the bottom number. It tells how many equal parts make the whole.' },
    { question: 'In 3/4, which number is the numerator?', options: ['3', '4', '7', 'Both 3 and 4'], answer: '3', explanation: 'The numerator is the top number. It counts the parts being considered.' },
    { question: 'Why must fraction parts be equal-sized?', options: ['So every part has the same share of the whole', 'So there are always four parts', 'So the fraction has no denominator', 'So the whole can change size'], answer: 'So every part has the same share of the whole', explanation: 'Fractions describe equal parts. Unequal pieces do not each represent the same fraction of the whole.' },
    { question: 'Which is larger when the wholes are the same size: 1/2 or 1/3?', options: ['1/2', '1/3', 'They are equal', 'It cannot be compared'], answer: '1/2', explanation: 'Splitting the same whole into two equal parts makes larger pieces than splitting it into three.' }
  ],
  multiplication: [
    { question: 'Four groups have three counters in each group. How many counters are there?', options: ['7', '12', '9', '4'], answer: '12', explanation: 'Four equal groups of three are 3 + 3 + 3 + 3 = 12.' },
    { question: 'What does 3 × 4 mean in an array?', options: ['3 rows of 4', '3 plus 4', '4 rows with 3 missing', '3 groups of 1'], answer: '3 rows of 4', explanation: '3 × 4 can be shown as three rows with four objects in each row.' },
    { question: 'What is the product of 5 × 2?', options: ['7', '10', '25', '3'], answer: '10', explanation: 'Five groups of two make 2 + 2 + 2 + 2 + 2 = 10. The product is 10.' },
    { question: 'Which expression shows four equal groups of three?', options: ['4 × 3', '4 + 3', '3 − 4', '4 ÷ 3'], answer: '4 × 3', explanation: 'Multiplication is a short way to write repeated equal groups: four groups of three is 4 × 3.' }
  ],
  geometry: [
    { question: 'How many straight sides does a triangle have?', options: ['2', '3', '4', '0'], answer: '3', explanation: 'A triangle has three straight sides and three vertices.' },
    { question: 'Which shape has four equal sides and four corners?', options: ['Rectangle', 'Circle', 'Square', 'Triangle'], answer: 'Square', explanation: 'A square has four sides of equal length and four corners.' },
    { question: 'How many vertices does a circle have?', options: ['1', '2', '4', '0'], answer: '0', explanation: 'A circle has no straight sides, so it has no vertices or corners.' },
    { question: 'What is a vertex?', options: ['A curved edge', 'A corner where two sides meet', 'The middle of a circle', 'A shape’s colour'], answer: 'A corner where two sides meet', explanation: 'A vertex is a corner where two sides meet. The plural is vertices.' }
  ],
  'solar-system': [
    { question: 'Which object is at the centre of our Solar System?', options: ['Earth', 'The Moon', 'The Sun', 'Mars'], answer: 'The Sun', explanation: 'The Sun is the star at the centre of our Solar System. The planets orbit it.' },
    { question: 'Which planet is third from the Sun?', options: ['Venus', 'Earth', 'Mars', 'Jupiter'], answer: 'Earth', explanation: 'The order begins Mercury, Venus, Earth. Earth is third from the Sun.' },
    { question: 'Which planet is often called the Red Planet?', options: ['Neptune', 'Mars', 'Saturn', 'Mercury'], answer: 'Mars', explanation: 'Mars looks reddish because of iron-rich dust on its surface.' },
    { question: 'Which planet is farthest from the Sun?', options: ['Jupiter', 'Uranus', 'Saturn', 'Neptune'], answer: 'Neptune', explanation: 'Neptune is the eighth and farthest planet from the Sun.' }
  ],
  'living-things': [
    { question: 'What do plants need to make their own food?', options: ['Sunlight', 'Plastic', 'Sand only', 'Moonlight only'], answer: 'Sunlight', explanation: 'Plants use light energy, along with water and carbon dioxide, to make food.' },
    { question: 'What is a habitat?', options: ['A place where an organism lives', 'A kind of food', 'An animal’s body part', 'A tool for planting'], answer: 'A place where an organism lives', explanation: 'A habitat is the place that provides an organism with resources such as food, water and shelter.' },
    { question: 'Which is an example of an adaptation?', options: ['A cactus storing water in its thick stem', 'A rock getting wet in rain', 'A toy car rolling downhill', 'A cup holding water'], answer: 'A cactus storing water in its thick stem', explanation: 'Storing water helps a cactus live in a dry habitat. It is a useful adaptation.' },
    { question: 'Which group includes only living things?', options: ['Oak tree, butterfly, mushroom', 'Pebble, oak tree, glass cup', 'Toy car, mushroom, rock', 'Water, butterfly, spoon'], answer: 'Oak tree, butterfly, mushroom', explanation: 'Trees, butterflies and mushrooms are living organisms. Rocks and objects are not alive.' }
  ],
  materials: [
    { question: 'Which property makes glass useful for a window?', options: ['Transparent', 'Absorbent', 'Flexible', 'Soft'], answer: 'Transparent', explanation: 'Transparent glass lets light pass through and allows us to see through a window.' },
    { question: 'Which material is chosen to soak up a spill?', options: ['Sponge', 'Glass', 'Metal', 'Plastic ruler'], answer: 'Sponge', explanation: 'A sponge is absorbent, so it takes in liquid.' },
    { question: 'Which property lets a rubber band stretch?', options: ['Flexible', 'Transparent', 'Hard', 'Waterproof'], answer: 'Flexible', explanation: 'Flexible materials can bend or stretch without breaking easily.' },
    { question: 'Why is waterproof material useful for a raincoat?', options: ['It keeps water from passing through', 'It lets light through', 'It soaks up rain', 'It makes the coat transparent'], answer: 'It keeps water from passing through', explanation: 'A waterproof material helps keep rain away from the person wearing the coat.' }
  ]
};

window.LEARNSPHERE_MATCHING = {
  fractions: [
    { left: '1/2', right: 'One of two equal parts' },
    { left: '3/4', right: 'Three of four equal parts' },
    { left: 'Numerator', right: 'Number of parts selected' },
    { left: 'Denominator', right: 'Total equal parts in the whole' }
  ],
  multiplication: [
    { left: '3 × 4', right: '12' },
    { left: 'Array', right: 'Rows and columns' },
    { left: 'Equal groups', right: 'Same amount in every group' },
    { left: 'Product', right: 'Answer to a multiplication' }
  ],
  geometry: [
    { left: 'Triangle', right: '3 sides' },
    { left: 'Square', right: '4 equal sides' },
    { left: 'Rectangle', right: '4 corners' },
    { left: 'Circle', right: '0 vertices' }
  ],
  'solar-system': [
    { left: 'The Sun', right: 'Star at the centre of our Solar System' },
    { left: 'Earth', right: 'Third planet from the Sun' },
    { left: 'Mars', right: 'The Red Planet' },
    { left: 'Jupiter', right: 'Largest planet' }
  ],
  'living-things': [
    { left: 'Plant', right: 'Needs sunlight' },
    { left: 'Animal', right: 'Needs food, water and air' },
    { left: 'Habitat', right: 'Place where an organism lives' },
    { left: 'Adaptation', right: 'Feature that helps an organism survive' }
  ],
  materials: [
    { left: 'Glass', right: 'Transparent' },
    { left: 'Rubber', right: 'Flexible' },
    { left: 'Metal', right: 'Strong and hard' },
    { left: 'Sponge', right: 'Absorbent' }
  ]
};
