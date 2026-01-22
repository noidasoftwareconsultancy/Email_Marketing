# Campaign Components

## TagSelector Component

A reusable component for selecting contact tags with real-time contact count updates.

### Features

- **Tag Selection**: Select multiple tags from available contact tags
- **Real-time Contact Count**: Shows the number of contacts that match the selected tags
- **Autocomplete**: Type to search and filter available tags
- **Tag Statistics**: Displays contact count for each tag
- **Visual Feedback**: Shows selected tags with counts and easy removal

### Usage

```tsx
import { TagSelector } from '@/components/campaigns/TagSelector';

function MyComponent() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <TagSelector
      selectedTags={selectedTags}
      onChange={setSelectedTags}
      label="Target Tags"
      helperText="Select tags to target specific contacts"
    />
  );
}
```

### Props

- `selectedTags`: Array of currently selected tag strings
- `onChange`: Callback function when tags change
- `label`: Label text for the component (optional)
- `helperText`: Helper text displayed below the input (optional)

### API Endpoint

The component uses `/api/contacts/tags` endpoint which:
- Returns all unique tags with contact counts
- Accepts `tags` query parameter to get filtered contact count
- Only counts ACTIVE contacts with `doNotEmail: false`

## CampaignScheduler Component

Enhanced to display selected tags and their target audience.

### New Features

- Shows selected target tags in the scheduler modal
- Displays "all active contacts" when no tags are selected
- Visual tag badges for better UX

### Props

- `targetTags`: Array of tag strings (optional) - displays the tags being targeted
