import { Button } from '../button/button';

export function Pagination() {
  return (
    <div className="mt-8 flex justify-center">
      <Button variant="outline" className="mr-2">
        Previous
      </Button>
      <Button variant="outline" className="mr-2">
        1
      </Button>
      <Button variant="outline" className="mr-2">
        2
      </Button>
      <Button variant="outline" className="mr-2">
        3
      </Button>
      <Button variant="outline">Next</Button>
    </div>
  );
}
