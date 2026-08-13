import { useEffect, useState } from 'react';
import { getCookie } from '@/shared/utils/cookies';
import { getUsers } from '@/features/admin/api/adminApi';
import type { UserListItem } from '@/shared/types/admin';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const PAGE_SIZE = 10;

export function UsersListPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    getUsers(page, PAGE_SIZE, getCookie('authToken')!)
      .then((result) => {
        setUsers(result.items);
        setTotalCount(result.totalCount);
      })
      .catch(() => setError('Unexpected error while loading users.'))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Registered users</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="py-2">{user.email}</TableCell>
                  <TableCell className="py-2">{user.firstName}</TableCell>
                  <TableCell className="py-2">{user.lastName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between gap-4 mt-4">
            <PaginationLink
              href="#"
              size="icon"
              aria-label="Previous"
              aria-disabled={page === 1}
              className={page === 1 ? 'cursor-not-allowed opacity-50' : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
            >
              <ChevronLeftIcon />
            </PaginationLink>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <PaginationLink
              href="#"
              size="icon"
              aria-label="Next"
              aria-disabled={page === totalPages}
              className={page === totalPages ? 'cursor-not-allowed opacity-50' : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) setPage(page + 1);
              }}
            >
              <ChevronRightIcon />
            </PaginationLink>
          </div>
        </>
      )}
    </div>
  );
}