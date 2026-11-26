// The subject data is kept in one place so later lesson pages can reuse it.
window.LEARNSPHERE_SUBJECTS = [
  {
    id: 'maths', name: 'Maths', icon: '▦', theme: 'maths',
    tagline: 'Think, solve and discover.',
    description: 'Explore numbers, spot patterns and use your problem-solving skills to tackle fun challenges.',
    dashboardDescription: 'Numbers, patterns and problem solving',
    tags: ['Fractions', 'Multiplication', 'Shapes'],
    lessons: [
      { id: 'fractions', title: 'Fractions: Parts of a Whole', description: 'Discover how equal parts make up a whole.', icon: '◕', minutes: 8 },
      { id: 'multiplication', title: 'Multiplication: Patterns and Products', description: 'Explore equal groups, arrays and number patterns.', icon: '⠿', minutes: 8 },
      { id: 'geometry', title: 'Shapes: Explore Geometry', description: 'Describe shapes by their sides and corners.', icon: '△', minutes: 7 }
    ]
  },
  {
    id: 'science', name: 'Science', icon: '✿', theme: 'science',
    tagline: 'Ask questions about our world.',
    description: 'Look closely at the world around you and learn about space, nature and the things we use.',
    dashboardDescription: 'Discover the world around you',
    tags: ['Solar System', 'Living Things', 'Materials'],
    lessons: [
      { id: 'solar-system', title: 'The Solar System', description: 'Meet the Sun and the planets in our cosmic neighbourhood.', icon: '☼', minutes: 9 },
      { id: 'living-things', title: 'Living Things', description: 'Find out what plants and animals need to live.', icon: '❋', minutes: 8 },
      { id: 'materials', title: 'Materials Around Us', description: 'Compare materials and the properties that make them useful.', icon: '◇', minutes: 8 }
    ]
  }
];

// Lesson copy and small activities are data-driven; lesson.js supplies the shared page template.
window.LEARNSPHERE_LESSONS = {
  fractions: {
    subject: 'maths', intro: 'Fractions help us describe equal parts of a whole. Let’s use pictures and everyday examples to see what the numbers mean.',
    objectives: ['Explain what the numerator and denominator tell us.', 'Recognise that fraction parts must be equal.', 'Compare simple fractions by looking at their size.'],
    sections: [
      { title: 'A fraction names equal parts', paragraphs: ['Imagine one whole pizza cut into four slices that are exactly the same size. If you take one slice, you have one out of four equal parts: one quarter, written 1/4.', 'The bottom number, called the denominator, tells how many equal parts make the whole. The top number, called the numerator, tells how many of those parts we are talking about.'], example: 'In 3/4, the 4 says the whole is split into four equal parts. The 3 says three parts are selected.' },
      { title: 'Equal parts matter', paragraphs: ['If a pizza is cut into one large piece and three tiny pieces, those are not four equal parts. We cannot call each piece one quarter. Fractions only describe equal-sized parts of the same whole.', 'The same idea works with a paper strip, a chocolate bar, or a shape divided into matching pieces.'], example: 'Fold a strip in half so the two parts match. One part is 1/2. Split it into three equal sections and one section is 1/3.' },
      { title: 'Compare by looking', paragraphs: ['When the whole is the same size, more equal slices usually means each slice is smaller. One half is larger than one third, while three quarters is larger than one half.', 'A picture can help: shade the same-sized whole, then compare how much is shaded.'] }
    ],
    takeaway: ['The denominator counts all equal parts in the whole.', 'The numerator counts the parts being considered.', 'A fair fraction picture uses equal-sized parts.'],
    activity: { kind: 'worked-example', title: 'Worked Example: Read 3/4', prompt: 'Three equal pieces are shaded in this whole. Let’s name the fraction together.', total: 4, shaded: 3, fraction: '3/4', steps: ['Count all equal pieces: there are 4. This is the denominator, so write it on the bottom.', 'Count the shaded pieces: there are 3. This is the numerator, so write it on the top.', 'Put them together: 3 shaded pieces out of 4 equal pieces is 3/4.'] }
  },
  multiplication: {
    subject: 'maths', intro: 'Multiplication is a quick way to count equal groups. Arrays and number patterns help us see why the answers make sense.',
    objectives: ['Describe multiplication as repeated addition.', 'Build an array using rows and columns.', 'Find a product by counting equal groups.'],
    sections: [
      { title: 'Equal groups make multiplication', paragraphs: ['Multiplication joins groups that have the same number in each group. Four bags with three apples in each bag make 3 + 3 + 3 + 3 apples.', 'Instead of adding four times, we write 4 × 3. It means four groups of three, which makes 12. The answer to a multiplication is called the product.'], example: 'Five pairs of socks: 5 groups of 2 = 5 × 2 = 10 socks.' },
      { title: 'Arrays show rows and columns', paragraphs: ['An array is an arrangement in equal rows and columns. It makes groups easier to count and shows that the same total can be described in two ways.', 'Three rows of four dots make 12 dots. We can write 3 × 4 = 12. Turning the array gives four rows of three, and the total stays 12.'], example: 'A tray with 2 rows of 5 cups has 2 × 5 = 10 cups.' },
      { title: 'Patterns help us work it out', paragraphs: ['The 5 times table ends in 0 or 5. In the 2 times table, each answer is an even number. Patterns let us check our thinking and solve new facts.', 'You can also split a group: 6 × 4 is two groups of 3 × 4, so 12 + 12 = 24.'] }
    ],
    takeaway: ['Multiplication counts equal groups.', 'Rows and columns make an array.', 'The product is the total number in all the groups.'],
    activity: { kind: 'array', title: 'Build an array', prompt: 'Use the controls to make 3 rows with 4 dots in each row. Then check your array.', startRows: 2, startColumns: 2, rows: 3, columns: 4, answer: 12, explanation: 'You made 3 rows of 4. That is 4 + 4 + 4 = 12 dots, so 3 × 4 = 12.' }
  },
  geometry: {
    subject: 'maths', intro: 'Geometry helps us describe shapes and the spaces around us. Let’s look closely at sides, corners and familiar objects.',
    objectives: ['Identify triangles, squares, rectangles and circles.', 'Count sides and vertices (corners).', 'Connect shapes with objects we see every day.'],
    sections: [
      { title: 'Sides and vertices', paragraphs: ['A side is a straight edge of a 2D shape. A vertex (plural: vertices) is a corner where two sides meet. We can describe a shape by counting both.', 'A triangle has 3 sides and 3 vertices. A square has 4 equal sides and 4 vertices. A rectangle has 4 sides and 4 vertices; opposite sides are equal.'], example: 'A square tile has four equal sides. A rectangular book cover has four sides, with two long sides and two shorter sides.' },
      { title: 'Circles are different', paragraphs: ['A circle has one curved edge and no straight sides or vertices. This smooth edge helps wheels roll.', 'Shapes can appear in lots of sizes. A small triangle and a large triangle still have three sides and three vertices.'], example: 'Look for circles on a clock face, rectangles on a door, and triangles on some road signs.' },
      { title: 'Find geometry around you', paragraphs: ['Real objects can combine several shapes. A house drawing might use a rectangle for its walls and a triangle for its roof.', 'When you identify a shape, check its properties rather than only its colour or size.'] }
    ],
    takeaway: ['Triangles have 3 sides and 3 vertices.', 'Squares and rectangles have 4 sides and 4 vertices.', 'Circles have no straight sides or vertices.'],
    activity: { kind: 'shape', title: 'Choose the shape', prompt: 'Which shape has four equal sides and four corners?', answer: 'Square', choices: ['Triangle', 'Square', 'Circle'], explanation: 'A square has four sides of equal length and four vertices.' }
  },
  'solar-system': {
    subject: 'science', intro: 'Our Solar System is a family of worlds held by the Sun’s gravity. Let’s travel outward and learn the planets in order.',
    objectives: ['Explain that the Sun is a star at the centre of our Solar System.', 'Name the eight planets in order from the Sun.', 'Tell one way a star and a planet are different.'],
    sections: [
      { title: 'A star at the centre', paragraphs: ['The Solar System includes the Sun, eight planets and many smaller objects. The Sun is a star: it makes its own light and gives Earth much of the light and warmth we receive.', 'Planets do not make their own visible light like stars do. They travel around the Sun along paths called orbits. Gravity helps keep them in orbit.'], example: 'Earth orbits the Sun once each year. The Moon orbits Earth, so it is a natural satellite, not a planet.' },
      { title: 'Eight planets in order', paragraphs: ['Starting closest to the Sun, the planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune.', 'Mercury, Venus, Earth and Mars are rocky worlds. Jupiter and Saturn are very large gas giants. Uranus and Neptune are distant ice giants. Saturn is famous for its bright rings.'], example: 'Memory tip: “My Very Eager Mum Just Served Us Noodles” gives the first letter of each planet in order.' },
      { title: 'A very large neighbourhood', paragraphs: ['The planets are different sizes and distances from the Sun. The drawings in books often make the planets bigger and closer together so we can see them.', 'Earth is the only world we know of with living things. Scientists study other planets to understand how worlds form and change.'] }
    ],
    takeaway: ['The Sun is a star that gives light and warmth.', 'Eight planets orbit the Sun.', 'The order is Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.'],
    activity: { kind: 'sequence', title: 'Planet order challenge', prompt: 'Tap the planets in order, starting closest to the Sun.', items: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] }
  },
  'living-things': {
    subject: 'science', intro: 'Living things grow and need resources from their surroundings. Let’s explore what plants and animals need and how habitats help.',
    objectives: ['Recognise common characteristics of living things.', 'Compare the basic needs of plants and animals.', 'Explain how a habitat and an adaptation can help an organism.'],
    sections: [
      { title: 'What makes something living?', paragraphs: ['Living things are organised in a special way: they grow, use energy, respond to their surroundings and reproduce. A seed may look still, but it is alive and can grow when conditions are right.', 'A rock does not grow or use food. A toy can move when someone pushes it, but it does not respond by itself or grow into another toy.'], example: 'A young plant grows new leaves. A puppy grows into an adult dog. Both need resources to live.' },
      { title: 'Needs and habitats', paragraphs: ['Plants need light, water, air and nutrients. Animals need water, air and food; different animals eat different things.', 'A habitat is the place where an organism lives. It can provide food, water, shelter and space. A pond is a habitat for frogs, insects and many plants.'], example: 'A cactus can store water in its thick stem, helping it live in dry places. This helpful feature is an adaptation.' },
      { title: 'Living things interact', paragraphs: ['Plants and animals depend on their surroundings and sometimes on one another. Bees visit flowers for nectar and can carry pollen between flowers.', 'If a habitat changes, organisms may need to move, adapt over many generations, or they may struggle to survive.'] }
    ],
    takeaway: ['Living things grow and use resources.', 'Plants need light, water, air and nutrients; animals need food, water and air.', 'Habitats provide resources and shelter.'],
    activity: { kind: 'category', title: 'Living or non-living?', prompt: 'Sort each item into the right group.', items: [{ name: 'Oak tree', answer: 'Living' }, { name: 'Pebble', answer: 'Non-living' }, { name: 'Butterfly', answer: 'Living' }, { name: 'Toy car', answer: 'Non-living' }, { name: 'Mushroom', answer: 'Living' }, { name: 'Glass cup', answer: 'Non-living' }] }
  },
  materials: {
    subject: 'science', intro: 'Materials are the stuff objects are made from. Their properties help us choose the right material for each job.',
    objectives: ['Name common materials used to make objects.', 'Describe materials using observable properties.', 'Explain why a property suits a particular use.'],
    sections: [
      { title: 'Objects are made from materials', paragraphs: ['A material is what something is made from. A chair might be made from wood or metal; a jumper is often made from fabric.', 'Materials have properties we can observe or test. They may be hard or soft, flexible or stiff, transparent or opaque, absorbent or waterproof.'], example: 'Glass is often transparent, so light can pass through a window. A sponge is absorbent, so it can soak up a spill.' },
      { title: 'Choose a property for the job', paragraphs: ['Designers choose materials by thinking about how an object will be used. A raincoat needs to keep water out, while a towel needs to absorb water.', 'Some materials have more than one useful property. Metal can be strong and is used for tools, but it can also bend or change shape when enough force is applied.'], example: 'A rubber band is flexible and stretches. A wooden ruler is stiff, so it keeps a straight edge.' },
      { title: 'Compare fairly', paragraphs: ['To compare materials, test one property at a time and keep the test fair. For absorbency, use the same amount of water on pieces of the same size.', 'The best material depends on the job. There is not always one “best” material for every situation.'] }
    ],
    takeaway: ['Materials are the substances objects are made from.', 'Properties include hardness, flexibility, transparency and absorbency.', 'A useful material is chosen to suit the object’s job.'],
    activity: { kind: 'property', title: 'Match a material property', prompt: 'Which property makes glass a good choice for a window?', questions: [
      { prompt: 'Which property makes glass a good choice for a window?', choices: ['Transparent', 'Absorbent', 'Flexible'], answer: 'Transparent', explanation: 'Transparent glass lets light pass through, so we can see through a window.' },
      { prompt: 'Which property helps a sponge soak up a spill?', choices: ['Hard', 'Absorbent', 'Transparent'], answer: 'Absorbent', explanation: 'An absorbent material takes in liquid. A sponge can soak up water.' },
      { prompt: 'Which property lets a rubber band stretch?', choices: ['Flexible', 'Opaque', 'Brittle'], answer: 'Flexible', explanation: 'A flexible material can bend or stretch without breaking easily.' }
    ] }
  }
};

window.LEARNSPHERE_ACHIEVEMENTS = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson.', icon: '⚑', target: 1, measure: p => p.lessonsCompleted.length },
  { id: 'quiz-master', name: 'Quiz Master', description: 'Complete a quiz.', icon: '✓', target: 1, measure: p => Object.keys(p.quizzes).length },
  { id: 'game-on', name: 'Game On', description: 'Complete a matching game.', icon: '◎', target: 1, measure: p => Object.keys(p.matching).length },
  { id: 'streak-starter', name: 'Streak Starter', description: 'Learn on 3 different days in a row.', icon: '♨', target: 3, measure: p => p.streak },
  { id: 'explorer', name: 'Explorer', description: 'Complete lessons in both subjects.', icon: '✧', target: 2, measure: p => new Set(p.lessonsCompleted.map(id => window.LEARNSPHERE_SUBJECTS.find(s => s.lessons.some(l => l.id === id))?.id).filter(Boolean)).size },
  { id: 'century-club', name: 'Century Club', description: 'Earn 100 XP.', icon: '★', target: 100, measure: p => p.totalXP },
  { id: 'xp-champion', name: 'XP Champion', description: 'Earn 500 XP.', icon: '♛', target: 500, measure: p => p.totalXP },
  { id: 'scholar', name: 'Scholar', description: 'Complete all 6 lessons.', icon: '✎', target: 6, measure: p => p.lessonsCompleted.length }
];
