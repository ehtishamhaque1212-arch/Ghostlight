const form = document.getElementById("storyForm");
const promptInput = document.getElementById("prompt");
const moodSelect = document.getElementById("mood");
const lengthSelect = document.getElementById("length");
const engineSelect = document.getElementById("engine");
const modelNameInput = document.getElementById("modelName");
const modelSettings = document.getElementById("modelSettings");
const summonButton = document.getElementById("summonButton");
const buttonText = document.getElementById("buttonText");
const connectionStatus = document.getElementById("connectionStatus");
const storyOutput = document.getElementById("storyOutput");
const resultTitle = document.getElementById("resultTitle");
const resultMeta = document.getElementById("resultMeta");
const copyButton = document.getElementById("copyButton");

let latestStory = "";

engineSelect.addEventListener("change", () => {
  modelSettings.hidden = engineSelect.value !== "local";
  connectionStatus.textContent = engineSelect.value === "local" ? "LOCAL MODEL SELECTED" : "OFFLINE MODE READY";
});

copyButton.addEventListener("click", async () => {
  if (!latestStory) return;
  try {
    await navigator.clipboard.writeText(latestStory);
    copyButton.textContent = "Copied ✓";
    setTimeout(() => copyButton.textContent = "Copy story", 1500);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(storyOutput);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.textContent = "Select and copy";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) {
    promptInput.focus();
    promptInput.setCustomValidity("Write a scene or idea first.");
    promptInput.reportValidity();
    promptInput.setCustomValidity("");
    return;
  }

  setLoading(true);
  storyOutput.textContent = "";
  resultTitle.textContent = "Something is stirring…";
  resultMeta.textContent = "OPENING A CHANNEL";
  copyButton.disabled = true;

  try {
    let story;
    let source;
    if (engineSelect.value === "local") {
      try {
        story = await generateWithOllama(prompt, moodSelect.value, lengthSelect.value, modelNameInput.value.trim() || "llama3.2");
        source = `GENERATED LOCALLY WITH OLLAMA · MODEL: ${(modelNameInput.value.trim() || "llama3.2").toUpperCase()}`;
      } catch (error) {
        throw new Error(`${error.message} You can switch to “Offline story engine” to try the built-in generator.`);
      }
    } else {
      story = generateOfflineStory(prompt, moodSelect.value, lengthSelect.value);
      source = "BUILT-IN OFFLINE STORY ENGINE · NO MODEL OR INTERNET REQUIRED";
    }

    latestStory = story;
    renderStory(story);
    resultTitle.textContent = chooseTitle(prompt);
    resultMeta.textContent = source;
    connectionStatus.textContent = engineSelect.value === "local" ? "LOCAL TRANSMISSION COMPLETE" : "OFFLINE TRANSMISSION COMPLETE";
    copyButton.disabled = false;
  } catch (error) {
    storyOutput.textContent = error.message;
    resultTitle.textContent = "The signal faded.";
    resultMeta.textContent = "CHECK LOCAL MODEL CONNECTION";
    connectionStatus.textContent = "CONNECTION NEEDS ATTENTION";
  } finally {
    setLoading(false);
  }
});

async function generateWithOllama(prompt, mood, length, model) {
  const wordGuide = { short: "150–220", medium: "350–500", long: "650–850" }[length];
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        {
          role: "system",
          content: `You are Ghostlight, a creative horror and remembrance storyteller. Write an original story of approximately ${wordGuide} words. Atmosphere: ${mood}. Use vivid atmosphere, suspense, and emotional depth without graphic violence. Treat cultural remembrance respectfully; do not claim to contact real spirits or present fiction as fact. Give the story a short title on its own first line.`
        },
        { role: "user", content: `Story seed: ${prompt}` }
      ],
      options: { temperature: 0.9 }
    })
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error(`Ollama could not find model “${model}”. Open a terminal and run: ollama pull ${model}`);
    throw new Error(`Ollama returned HTTP ${response.status}. Check that Ollama is running.`);
  }
  const data = await response.json();
  const story = data?.message?.content?.trim();
  if (!story) throw new Error("The local model returned an empty response. Try again.");
  return story;
}

function generateOfflineStory(seed, mood, length) {
  const seedLower = seed.toLowerCase();
  const subject = seedLower.includes("arcade") ? "the arcade machine" :
    seedLower.includes("house") ? "the house at the end of the lane" :
    seedLower.includes("forest") ? "the forest beyond the old road" :
    seedLower.includes("letter") ? "the unopened letter" :
    seedLower.includes("family") || seedLower.includes("memory") ? "the box of family memories" :
    "the strange object at the centre of the story";
  const opening = [
    `At 2:17 a.m., ${subject} woke with a sound like a breath caught behind glass.`,
    `The first rule was simple: never answer when ${subject} called your name.`,
    `Rain had erased every footprint outside, except the ones that led towards ${subject}.`
  ];
  const details = [
    "A pale light pulsed beneath its surface, steady as a sleeping heartbeat.",
    "Somewhere in the walls, a tiny mechanism clicked three times, paused, then clicked once more.",
    "The air smelled of dust, cold metal, and flowers left too long in a closed room.",
    "On the nearest window, a message appeared backwards, as if written by someone standing on the other side.",
    "Every clock in the building stopped at the same minute, though none of them shared a power source."
  ];
  const turns = [
    "Then the protagonist noticed the impossible detail: the message used a nickname nobody had spoken aloud in years.",
    "The sound was not a warning. It was a memory trying to find the right door.",
    "Beneath the static came a familiar melody, imperfect and gentle, like someone humming from the next room.",
    "The shadow moved a moment before its owner did. It seemed to be practising."
  ];
  const endings = [
    "At sunrise, everything looked ordinary again. Only one small light remained on, waiting patiently for the next listener.",
    "By morning, the room was empty. On the table lay a note in fresh ink: “Thank you for remembering.”",
    "The door stayed locked from that day on. But whenever rain touched the windows, a quiet voice counted everyone safely home."
  ];
  const count = length === "short" ? 2 : length === "long" ? 5 : 3;
  const paragraphs = [
    opening[Math.floor(Math.random() * opening.length)],
    `${details[0]} ${details[1]} ${details[2]}`,
    `${turns[Math.floor(Math.random() * turns.length)]} ${details[3]}`,
  ];
  if (count >= 3) paragraphs.push(`${mood.charAt(0).toUpperCase() + mood.slice(1)} settled over the room. The protagonist could leave, of course. The handle was right there. But something on the other side had waited a very long time, and leaving felt more frightening than listening.`);
  if (count >= 5) paragraphs.push(`${details[4]} The old silence began to feel less like emptiness and more like a person making space for someone else to speak. The protagonist sat down and told the room one true story from their own life. For the first time that night, the light stopped flickering.`);
  paragraphs.push(endings[Math.floor(Math.random() * endings.length)]);
  return `${chooseTitle(seed)}\n\n${paragraphs.join("\n\n")}\n\n*Inspired by: ${seed}*`;
}

function chooseTitle(seed) {
  const titles = ["The Last Signal", "A Light Behind the Wall", "The Things We Keep", "Static at Midnight", "A Room That Remembers"];
  const words = seed.trim().split(/\s+/).filter(Boolean);
  if (words.length > 0 && words.length < 7) {
    const cleaned = words.join(" ").replace(/[.!?]+$/, "");
    return `The ${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)}`;
  }
  return titles[Math.floor(Math.random() * titles.length)];
}

function renderStory(story) {
  const paragraphs = story.split(/\n{2,}/);
  storyOutput.replaceChildren();
  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    storyOutput.appendChild(p);
  });
}

function setLoading(loading) {
  summonButton.disabled = loading;
  buttonText.textContent = loading ? "LISTENING TO THE DARK…" : "SUMMON A STORY";
}

modelSettings.hidden = engineSelect.value !== "local";
