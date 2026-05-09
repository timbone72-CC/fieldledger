import { STORAGE_KEYS } from "../constants/storageKeys.js";

const EMPTY_JOB_SUGGESTIONS = {
  companies: [],
  rigs: [],
};

function cleanSuggestionValues(values) {
  return Array.from(
    new Set(
      (Array.isArray(values) ? values : [])
        .map((value) => value?.trim())
        .filter(Boolean),
    ),
  ).sort();
}

export function loadJobSuggestions() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEYS.JOB_SUGGESTIONS);

    if (!rawValue) {
      return EMPTY_JOB_SUGGESTIONS;
    }

    const parsedValue = JSON.parse(rawValue);

    return {
      companies: cleanSuggestionValues(parsedValue.companies),
      rigs: cleanSuggestionValues(parsedValue.rigs),
    };
  } catch {
    return EMPTY_JOB_SUGGESTIONS;
  }
}

export function saveJobSuggestions(nextSuggestions) {
  const cleanSuggestions = {
    companies: cleanSuggestionValues(nextSuggestions?.companies),
    rigs: cleanSuggestionValues(nextSuggestions?.rigs),
  };

  localStorage.setItem(STORAGE_KEYS.JOB_SUGGESTIONS, JSON.stringify(cleanSuggestions));

  return cleanSuggestions;
}

export function rememberJobSuggestions(job) {
  const currentSuggestions = loadJobSuggestions();

  return saveJobSuggestions({
    companies: [...currentSuggestions.companies, job?.company],
    rigs: [...currentSuggestions.rigs, job?.rigNameOrNumber],
  });
}
