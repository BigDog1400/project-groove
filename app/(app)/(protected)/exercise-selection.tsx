import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ExerciseSelectionForm } from '../../../components/exercises/exercise-selection-form';
import { Button } from '../../../components/ui/button';
import { Text } from '../../../components/ui/text';

export default function ExerciseSelectionScreen() {
  const handleSaved = () => {
    router.push('/(app)/(protected)');
  };

  return (
    <SafeAreaView className="flex-1 bg-muted" edges={['left', 'right']}>
      <ExerciseSelectionForm onSaved={handleSaved} />
    </SafeAreaView>
  );
}