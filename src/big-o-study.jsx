import { useState, useMemo } from "react";

const complexities = [
  {
    name: "O(1)",
    label: "Constant",
    color: "#2E7D32",
    emoji: "⚡",
    desc: "No matter how big your input is, it always takes the same amount of time. You go directly to what you need.",
    example: `// Accessing an array by index
const arr = [10, 20, 30, 40, 50];
const val = arr[3]; // Always 1 step

// HashMap / Object lookup
const map = { "alice": 90, "bob": 85 };
const score = map["alice"]; // Always 1 step

// Checking if a number is even
const isEven = n % 2 === 0;`,
    realWorld: "Looking up a word in a dictionary when someone tells you the exact page number. Doesn't matter if it's a 100-page or 10,000-page dictionary.",
    interview: "Hash table lookups, array access by index, push/pop on a stack, checking the length of a collection.",
    howToSpot: "No loops. No recursion. Direct access by key or index. Fixed number of operations regardless of input size."
  },
  {
    name: "O(log n)",
    label: "Logarithmic",
    color: "#1565C0",
    emoji: "🔍",
    desc: "Each step cuts the remaining work in half. Extremely efficient — even a billion items only needs ~30 steps.",
    example: `// Binary Search
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
    // Each loop cuts the search space in HALF
  }
  return -1;
}`,
    realWorld: "Guessing a number between 1-1000. You always guess the middle: 'Is it more or less than 500?' Each guess eliminates half the possibilities. Takes ~10 guesses max.",
    interview: "Binary search, balanced BST operations, finding an element in a sorted array, divide-and-conquer where you only recurse on ONE half.",
    howToSpot: "The input is being divided in half each iteration. Look for: while loops where the counter doubles or halves (i *= 2, i /= 2, low/high converging)."
  },
  {
    name: "O(n)",
    label: "Linear",
    color: "#F9A825",
    emoji: "📏",
    desc: "You look at every item once. If the input doubles, the time doubles. Simple and predictable.",
    example: `// Finding the max value
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    // Visits every element exactly once
  }
  return max;
}

// Also O(n): two separate loops
// O(n) + O(n) = O(2n) = O(n)
for (let i = 0; i < n; i++) { /* ... */ }
for (let i = 0; i < n; i++) { /* ... */ }`,
    realWorld: "Reading every page of a book to find a specific quote. 200 pages = 200 page-checks. 400 pages = 400 page-checks.",
    interview: "Linear search, iterating through an array/list, counting elements, finding min/max, single-pass algorithms, most hash table constructions.",
    howToSpot: "A single loop that goes through the entire input once. Multiple sequential (not nested) loops are still O(n). Constants are dropped: O(3n) → O(n)."
  },
  {
    name: "O(n log n)",
    label: "Linearithmic",
    color: "#E65100",
    emoji: "📊",
    desc: "The sweet spot for sorting. You're doing something log(n) for each of n items — or splitting and merging repeatedly.",
    example: `// Merge Sort (conceptually)
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  // Split in half: log(n) levels of splitting
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  // Merge: n work at each level
  return merge(left, right);
}

// In practice, just know:
// .sort() in JS is O(n log n)
arr.sort((a, b) => a - b);`,
    realWorld: "Sorting a deck of cards using merge sort: you split the deck in half repeatedly (log n splits), then merge them back together (n work per merge level).",
    interview: "Merge sort, quicksort (average case), heapsort, any problem where you sort first then do something linear. 'Sort it, then scan it' = O(n log n).",
    howToSpot: "Efficient sorting algorithms. Divide-and-conquer where you recurse on BOTH halves and do O(n) work per level. If your solution starts with 'first, sort the array,' it's at least O(n log n)."
  },
  {
    name: "O(n²)",
    label: "Quadratic",
    color: "#AD1457",
    emoji: "🐌",
    desc: "Nested loops over the same input. If the input doubles, the time quadruples. Gets slow fast.",
    example: `// Checking for duplicates (brute force)
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      // Inner loop runs ~n times for each
      // outer loop iteration
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// Bubble Sort
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j] > arr[j+1]) swap(arr, j, j+1);
    }
  }
}`,
    realWorld: "Comparing every person in a room to every other person to see if anyone has the same birthday. 10 people = 45 comparisons. 100 people = 4,950. 1,000 people = 499,500.",
    interview: "Bubble sort, selection sort, insertion sort, brute-force duplicate detection, comparing all pairs. Often the 'naive' solution that interviewers want you to optimize.",
    howToSpot: "Two nested loops where both iterate over the input. The key question: does the inner loop depend on the size of the same input as the outer loop?"
  },
  {
    name: "O(2ⁿ)",
    label: "Exponential",
    color: "#7B1FA2",
    emoji: "💥",
    desc: "Each element doubles the work. Grows absurdly fast — 30 items = over a billion operations. Usually means you need a better approach.",
    example: `// Naive Fibonacci (without memoization)
function fib(n) {
  if (n <= 1) return n;
  // Each call branches into TWO more calls
  return fib(n - 1) + fib(n - 2);
}
// fib(30) makes over a billion calls!

// Generating all subsets of a set
function subsets(arr) {
  if (arr.length === 0) return [[]];
  const rest = subsets(arr.slice(1));
  // Each element doubles the number of subsets
  return rest.concat(
    rest.map(s => [arr[0], ...s])
  );
}`,
    realWorld: "Trying every combination of on/off switches. 10 switches = 1,024 combos. 20 = 1,048,576. 30 = over a billion. It gets unusable very quickly.",
    interview: "Naive recursive solutions without memoization, subset generation, some backtracking problems. If you see this, mention dynamic programming as an optimization.",
    howToSpot: "Recursion where each call makes TWO (or more) recursive calls and there's no memoization. If you draw the call tree and it's a full binary tree, it's O(2ⁿ)."
  }
];

const cheatSheet = [
  { structure: "Array access by index", op: "arr[i]", time: "O(1)" },
  { structure: "Array search (unsorted)", op: "find value", time: "O(n)" },
  { structure: "Array search (sorted)", op: "binary search", time: "O(log n)" },
  { structure: "Array push/pop (end)", op: "push, pop", time: "O(1)" },
  { structure: "Array insert/delete (middle)", op: "splice", time: "O(n)" },
  { structure: "Hash Map", op: "get, set, delete", time: "O(1) avg" },
  { structure: "Sorting (good)", op: "merge/quick sort", time: "O(n log n)" },
  { structure: "Sorting (bad)", op: "bubble/selection", time: "O(n²)" },
  { structure: "Linked List search", op: "find value", time: "O(n)" },
  { structure: "Linked List insert (head)", op: "prepend", time: "O(1)" },
  { structure: "BST search (balanced)", op: "find value", time: "O(log n)" },
  { structure: "BST search (worst)", op: "find value", time: "O(n)" },
];

const quizQuestions = [
  {
    code: `function sum(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}`,
    answer: "O(n)",
    explanation: "Single loop through the entire array. Each element is visited once. If the array doubles in size, the loop runs twice as many times."
  },
  {
    code: `function first(arr) {\n  return arr[0];\n}`,
    answer: "O(1)",
    explanation: "Direct index access. Doesn't matter if the array has 10 or 10 million elements — it always takes one step."
  },
  {
    code: `function printPairs(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length; j++) {\n      console.log(arr[i], arr[j]);\n    }\n  }\n}`,
    answer: "O(n²)",
    explanation: "Two nested loops, both iterating over the full array. The inner loop runs n times for each of the n outer iterations: n × n = n²."
  },
  {
    code: `function search(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    let mid = Math.floor((lo+hi)/2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid+1;\n    else hi = mid-1;\n  }\n  return -1;\n}`,
    answer: "O(log n)",
    explanation: "Binary search. Each iteration cuts the search space in half. The loop runs at most log₂(n) times. 1,000 items → ~10 iterations. 1,000,000 items → ~20 iterations."
  },
  {
    code: `function twoLoops(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    console.log(arr[i]);\n  }\n  for (let j = 0; j < arr.length; j++) {\n    console.log(arr[j]);\n  }\n}`,
    answer: "O(n)",
    explanation: "Two separate (sequential, not nested) loops. O(n) + O(n) = O(2n). We drop constants in Big O, so O(2n) → O(n). They're not nested, so it doesn't multiply."
  },
  {
    code: `function sorted(arr) {\n  arr.sort((a,b) => a - b);\n  return arr[0];\n}`,
    answer: "O(n log n)",
    explanation: "The sort dominates: O(n log n). Accessing index [0] is O(1). The total is O(n log n + 1) = O(n log n). The biggest term wins."
  },
  {
    code: `function exists(arr, target) {\n  const set = new Set(arr);  // O(n)\n  return set.has(target);    // O(1)\n}`,
    answer: "O(n)",
    explanation: "Building the Set iterates through all n elements: O(n). The lookup is O(1). Total: O(n + 1) = O(n). Building the set is the bottleneck."
  },
  {
    code: `function fib(n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}`,
    answer: "O(2ⁿ)",
    explanation: "Each call branches into two recursive calls. The call tree doubles at each level. Without memoization, this is exponential. With memoization, it drops to O(n)."
  },
];

const tabs = ["Learn", "Cheat Sheet", "Practice"];

export default function BigOTeacher({ onNavigate }) {
  const [tab, setTab] = useState("Learn");
  const [selectedComplexity, setSelectedComplexity] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizSelected, setQuizSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [expandedSection, setExpandedSection] = useState("code");

  const current = complexities[selectedComplexity];

  const graphData = useMemo(() => {
    const points = [];
    const ns = [1,2,4,8,16,32,64];
    ns.forEach(n => {
      points.push({ n, vals: {
        "O(1)": 1,
        "O(log n)": Math.log2(n),
        "O(n)": n,
        "O(n log n)": n * Math.log2(Math.max(n,1)),
        "O(n²)": n * n,
      }});
    });
    return points;
  }, []);

  const maxVal = 64 * 64;
  const chartW = 580, chartH = 220, padL = 50, padB = 30, padT = 10, padR = 20;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padB - padT;

  const getX = (n) => padL + (n / 64) * plotW;
  const getY = (val) => padT + plotH - (Math.min(val, maxVal) / maxVal) * plotH;

  const lines = [
    { name: "O(1)", color: "#2E7D32" },
    { name: "O(log n)", color: "#1565C0" },
    { name: "O(n)", color: "#F9A825" },
    { name: "O(n log n)", color: "#E65100" },
    { name: "O(n²)", color: "#AD1457" },
  ];

  const handleQuizAnswer = (ans) => {
    if (quizRevealed) return;
    setQuizSelected(ans);
    setQuizRevealed(true);
    const correct = ans === quizQuestions[quizIndex].answer;
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const nextQuiz = () => {
    setQuizIndex(i => (i + 1) % quizQuestions.length);
    setQuizRevealed(false);
    setQuizSelected(null);
  };

  const sectionToggle = (s) => setExpandedSection(expandedSection === s ? null : s);

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      minHeight: "100vh",
      background: "#FAFAF7",
      padding: "20px 16px",
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
      <div 
        onClick={onNavigate}
        style={{
          fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
          color: "#999", fontFamily: "monospace", marginBottom: 4,
          cursor: "pointer", textDecoration: "underline"
        }}
      >Interview Prep</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px" }}>
          Big O Notation
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #E8E8E4" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "10px 20px", border: "none", borderBottom: tab === t ? "2px solid #1a1a1a" : "2px solid transparent",
              marginBottom: -2, background: "transparent", color: tab === t ? "#1a1a1a" : "#999",
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
            }}>{t}</button>
          ))}
        </div>

        {/* ===== LEARN TAB ===== */}
        {tab === "Learn" && (
          <div>
            {/* Core concept */}
            <div style={{
              padding: "18px 20px", background: "white", borderRadius: 12,
              border: "1px solid #E8E8E4", marginBottom: 16
            }}>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#333", margin: 0 }}>
                <strong>Big O</strong> answers one question: <em>as my input grows, how much slower does this get?</em> It doesn't measure exact time — it measures the <strong>growth rate</strong>. We drop constants (O(2n) → O(n)) and keep only the dominant term (O(n² + n) → O(n²)) because at large scale, only the fastest-growing term matters.
              </p>
            </div>

            {/* Growth chart */}
            <div style={{
              padding: "16px", background: "white", borderRadius: 12,
              border: "1px solid #E8E8E4", marginBottom: 16, overflowX: "auto"
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "monospace" }}>
                Growth Rates Compared
              </div>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", maxWidth: chartW }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(frac => {
                  const y = padT + plotH * (1 - frac);
                  return <g key={frac}>
                    <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="#eee" strokeWidth={1} />
                    <text x={padL - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#aaa" fontFamily="monospace">
                      {Math.round(frac * maxVal)}
                    </text>
                  </g>;
                })}
                {/* X axis labels */}
                {[1,16,32,48,64].map(n => (
                  <text key={n} x={getX(n)} y={chartH - 8} textAnchor="middle" fontSize={10} fill="#aaa" fontFamily="monospace">
                    n={n}
                  </text>
                ))}
                {/* Lines */}
                {lines.map(line => {
                  const path = graphData.map((pt, i) => {
                    const x = getX(pt.n);
                    const y = getY(pt.vals[line.name]);
                    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                  }).join(' ');
                  return <path key={line.name} d={path} fill="none" stroke={line.color} strokeWidth={2.5}
                    strokeLinecap="round" strokeLinejoin="round"
                    opacity={line.name === current.name ? 1 : 0.2} />;
                })}
                {/* Legend */}
                {lines.map((line, i) => (
                  <g key={line.name} opacity={line.name === current.name ? 1 : 0.35}>
                    <rect x={chartW - padR - 95} y={padT + 4 + i * 18} width={12} height={3} rx={1.5} fill={line.color} />
                    <text x={chartW - padR - 78} y={padT + 10 + i * 18} fontSize={11} fill="#555" fontFamily="monospace">{line.name}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Complexity selector */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {complexities.map((c, i) => (
                <button key={c.name} onClick={() => { setSelectedComplexity(i); setExpandedSection("code"); }}
                  style={{
                    padding: "6px 14px", borderRadius: 8,
                    border: selectedComplexity === i ? `2px solid ${c.color}` : "1px solid #ddd",
                    background: selectedComplexity === i ? c.color + "15" : "white",
                    color: selectedComplexity === i ? c.color : "#888",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "monospace"
                  }}>{c.emoji} {c.name}</button>
              ))}
            </div>

            {/* Detail card */}
            <div style={{
              background: "white", borderRadius: 14, border: `2px solid ${current.color}20`,
              overflow: "hidden", marginBottom: 16
            }}>
              <div style={{
                padding: "16px 20px", background: current.color + "10",
                borderBottom: `1px solid ${current.color}20`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{current.emoji}</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: current.color, fontFamily: "monospace" }}>{current.name}</div>
                    <div style={{ fontSize: 13, color: "#777" }}>{current.label} Time</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "16px 20px" }}>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#333", margin: "0 0 16px" }}>{current.desc}</p>

                {/* Accordion sections */}
                {[
                  { key: "code", label: "Code Example", content: (
                    <pre style={{
                      background: "#1a1a1a", color: "#e0e0e0", padding: "16px",
                      borderRadius: 8, fontSize: 12.5, lineHeight: 1.6,
                      overflowX: "auto", fontFamily: "'SF Mono', 'Fira Code', monospace", margin: 0,
                      whiteSpace: "pre-wrap", wordBreak: "break-word"
                    }}>{current.example}</pre>
                  )},
                  { key: "real", label: "Real-World Analogy", content: (
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#444", margin: 0 }}>{current.realWorld}</p>
                  )},
                  { key: "spot", label: "How to Spot It", content: (
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#444", margin: 0 }}>{current.howToSpot}</p>
                  )},
                  { key: "interview", label: "When It Shows Up in Interviews", content: (
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#444", margin: 0 }}>{current.interview}</p>
                  )},
                ].map(section => (
                  <div key={section.key} style={{ marginBottom: 8 }}>
                    <button onClick={() => sectionToggle(section.key)} style={{
                      width: "100%", textAlign: "left", padding: "10px 14px",
                      borderRadius: 8, border: "1px solid #eee",
                      background: expandedSection === section.key ? "#f8f8f5" : "white",
                      color: "#333", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      {section.label}
                      <span style={{ color: "#aaa", fontSize: 12 }}>{expandedSection === section.key ? "▲" : "▼"}</span>
                    </button>
                    {expandedSection === section.key && (
                      <div style={{ padding: "12px 14px" }}>{section.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key rules */}
            <div style={{
              padding: "18px 20px", background: "white", borderRadius: 12,
              border: "1px solid #E8E8E4"
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: "monospace" }}>
                Three Rules to Remember
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: "#333" }}>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: current.color }}>1. Drop constants.</strong> O(2n) and O(100n) are both just O(n). We only care about the shape of the growth, not the exact multiplier.</p>
                <p style={{ margin: "0 0 10px" }}><strong style={{ color: current.color }}>2. Keep the dominant term.</strong> O(n² + n + 100) → O(n²). At large n, the n² dwarfs everything else.</p>
                <p style={{ margin: 0 }}><strong style={{ color: current.color }}>3. Different inputs = different variables.</strong> A loop over array A (size n) nested inside a loop over array B (size m) is O(n × m), not O(n²).</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== CHEAT SHEET TAB ===== */}
        {tab === "Cheat Sheet" && (
          <div>
            <div style={{
              background: "white", borderRadius: 12, border: "1px solid #E8E8E4",
              overflow: "hidden", marginBottom: 16
            }}>
              <div style={{ padding: "14px 20px", background: "#f8f8f5", borderBottom: "1px solid #E8E8E4" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace" }}>
                  Common Operations & Their Complexities
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #eee" }}>
                      <th style={{ textAlign: "left", padding: "10px 16px", color: "#999", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>Data Structure</th>
                      <th style={{ textAlign: "left", padding: "10px 16px", color: "#999", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>Operation</th>
                      <th style={{ textAlign: "left", padding: "10px 16px", color: "#999", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cheatSheet.map((row, i) => {
                      const c = complexities.find(c => row.time.startsWith(c.name));
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "10px 16px", color: "#333" }}>{row.structure}</td>
                          <td style={{ padding: "10px 16px", color: "#666", fontFamily: "monospace", fontSize: 13 }}>{row.op}</td>
                          <td style={{ padding: "10px 16px" }}>
                            <span style={{
                              padding: "2px 10px", borderRadius: 4,
                              background: (c?.color || "#666") + "15",
                              color: c?.color || "#666",
                              fontFamily: "monospace", fontWeight: 700, fontSize: 13
                            }}>{row.time}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Decision framework */}
            <div style={{
              padding: "18px 20px", background: "white", borderRadius: 12,
              border: "1px solid #E8E8E4", marginBottom: 16
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontFamily: "monospace" }}>
                Quick Decision Framework
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.9, color: "#333" }}>
                <p style={{ margin: "0 0 8px" }}>🔑 <strong>No loops?</strong> → Probably <span style={{ fontFamily: "monospace", color: "#2E7D32", fontWeight: 700 }}>O(1)</span></p>
                <p style={{ margin: "0 0 8px" }}>🔑 <strong>Halving the input each step?</strong> → <span style={{ fontFamily: "monospace", color: "#1565C0", fontWeight: 700 }}>O(log n)</span></p>
                <p style={{ margin: "0 0 8px" }}>🔑 <strong>One loop through the data?</strong> → <span style={{ fontFamily: "monospace", color: "#F9A825", fontWeight: 700 }}>O(n)</span></p>
                <p style={{ margin: "0 0 8px" }}>🔑 <strong>Sort first, then scan?</strong> → <span style={{ fontFamily: "monospace", color: "#E65100", fontWeight: 700 }}>O(n log n)</span></p>
                <p style={{ margin: "0 0 8px" }}>🔑 <strong>Nested loops over the same input?</strong> → <span style={{ fontFamily: "monospace", color: "#AD1457", fontWeight: 700 }}>O(n²)</span></p>
                <p style={{ margin: 0 }}>🔑 <strong>Recursion that branches without memoization?</strong> → <span style={{ fontFamily: "monospace", color: "#7B1FA2", fontWeight: 700 }}>O(2ⁿ)</span></p>
              </div>
            </div>

            {/* Interview phrasing */}
            <div style={{
              padding: "18px 20px", background: "white", borderRadius: 12,
              border: "1px solid #E8E8E4"
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontFamily: "monospace" }}>
                How to Phrase It in an Interview
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: "#333" }}>
                <p style={{ margin: "0 0 12px" }}>When they ask <em>"What's the time complexity?"</em> — give the Big O, then explain why in one sentence:</p>
                <div style={{ background: "#f8f8f5", borderRadius: 8, padding: "14px 16px", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8, color: "#444" }}>
                  <p style={{ margin: "0 0 8px" }}>"This runs in <strong>O(n)</strong> — I'm iterating through the array once, doing constant work at each step."</p>
                  <p style={{ margin: "0 0 8px" }}>"The sort makes it <strong>O(n log n)</strong>, and the scan after is O(n), so the sort dominates."</p>
                  <p style={{ margin: 0 }}>"The brute force is <strong>O(n²)</strong> because of the nested loops, but I can bring it down to <strong>O(n)</strong> with a hash set."</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== PRACTICE TAB ===== */}
        {tab === "Practice" && (
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 16
            }}>
              <div style={{ fontSize: 14, color: "#777" }}>
                Question {quizIndex + 1} of {quizQuestions.length}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: score.total > 0 ? "#2E7D32" : "#999" }}>
                {score.correct}/{score.total} correct
              </div>
            </div>

            <div style={{
              background: "white", borderRadius: 14,
              border: "1px solid #E8E8E4", overflow: "hidden", marginBottom: 16
            }}>
              <div style={{
                padding: "14px 20px", background: "#f8f8f5",
                borderBottom: "1px solid #E8E8E4",
                fontSize: 14, fontWeight: 600, color: "#555"
              }}>What is the Big O of this function?</div>

              <div style={{ padding: "16px 20px" }}>
                <pre style={{
                  background: "#1a1a1a", color: "#e0e0e0", padding: "16px",
                  borderRadius: 8, fontSize: 13, lineHeight: 1.6,
                  fontFamily: "'SF Mono', 'Fira Code', monospace", margin: "0 0 16px",
                  overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word"
                }}>{quizQuestions[quizIndex].code}</pre>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"].map(opt => {
                    const isCorrect = opt === quizQuestions[quizIndex].answer;
                    const isSelected = opt === quizSelected;
                    let bg = "white", border = "1px solid #ddd", color = "#333";
                    if (quizRevealed) {
                      if (isCorrect) { bg = "#E8F5E9"; border = "2px solid #2E7D32"; color = "#2E7D32"; }
                      else if (isSelected && !isCorrect) { bg = "#FFEBEE"; border = "2px solid #C62828"; color = "#C62828"; }
                      else { bg = "#f5f5f5"; color = "#bbb"; }
                    }
                    return (
                      <button key={opt} onClick={() => handleQuizAnswer(opt)} style={{
                        padding: "12px", borderRadius: 10, border, background: bg, color,
                        fontSize: 16, fontWeight: 700, fontFamily: "monospace",
                        cursor: quizRevealed ? "default" : "pointer",
                        transition: "all 0.15s ease"
                      }}>{opt} {quizRevealed && isCorrect && "✓"} {quizRevealed && isSelected && !isCorrect && "✗"}</button>
                    );
                  })}
                </div>

                {quizRevealed && (
                  <div style={{
                    marginTop: 16, padding: "14px 18px",
                    background: quizSelected === quizQuestions[quizIndex].answer ? "#E8F5E9" : "#FFF3E0",
                    borderRadius: 10, borderLeft: `4px solid ${quizSelected === quizQuestions[quizIndex].answer ? "#2E7D32" : "#E65100"}`,
                    fontSize: 14, lineHeight: 1.7, color: "#333"
                  }}>
                    <strong>{quizSelected === quizQuestions[quizIndex].answer ? "Correct! " : `Not quite — it's ${quizQuestions[quizIndex].answer}. `}</strong>
                    {quizQuestions[quizIndex].explanation}
                  </div>
                )}
              </div>
            </div>

            {quizRevealed && (
              <button onClick={nextQuiz} style={{
                width: "100%", padding: "14px", borderRadius: 10,
                border: "none", background: "#1a1a1a", color: "white",
                fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
              }}>Next Question →</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
