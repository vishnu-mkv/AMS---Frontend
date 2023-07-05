import { Button } from "./ui/Button";
import { generatePaginationArray } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

function Pagination({ page, totalPages, setPage }: PaginationProps) {
  return (
    <div>
      <div className="flex justify-center gap-3 mt-5">
        {page > 1 && (
          <Button
            variant="outline"
            onClick={() => {
              setPage(page - 1);
            }}
          >
            Previous
          </Button>
        )}
        {generatePaginationArray(page, totalPages).map((_page, index) => {
          return (
            <Button
              key={index}
              variant={_page === page ? "default" : "outline"}
              onClick={() => {
                setPage(parseInt(_page as any));
              }}
            >
              {_page}
            </Button>
          );
        })}
        {page !== totalPages && (
          <Button
            variant="outline"
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
