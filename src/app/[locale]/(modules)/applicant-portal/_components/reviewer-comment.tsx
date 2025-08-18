import { AlertCircle } from "lucide-react";

interface ReviewerCommentProps {
  comment: string;
}

export function ReviewerComment({ comment }: ReviewerCommentProps) {
  return (
    <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-red-800">{comment}</p>
      </div>
    </div>
  );
}
