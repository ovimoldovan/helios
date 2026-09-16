import { useEffect, useState } from 'react';
import { getUsers, assignModerator, removeModerator } from '@/features/admin/api/adminApi';
import type { UserListItem } from '@/shared/types/admin';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationLink } from '@/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { LeftPanel } from '@/features/homepage/components/LeftPanel';

const PAGE_SIZE = 10;

export function UsersListPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    setError(null);

    getUsers(page, PAGE_SIZE)
        .then((result) => {
          setUsers(result.items);
          setTotalCount(result.totalCount);
        })
        .catch(() => setError(t('unexpectedErrorLoadingUsers')))
        .finally(() => setLoading(false));
  }, [page, t]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function handleAssignModerator(userId: string) {
    setProcessingUserId(userId);

    assignModerator(userId)
        .then((updatedUser) => {
          setUsers((prevUsers) =>
              prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
          );
        })
        .catch(() => setError(t('unexpectedErrorAssigningModerator')))
        .finally(() => setProcessingUserId(null));
  }

  // ✅ NOU - handler pentru remove moderator
  function handleRemoveModerator(userId: string) {
    setProcessingUserId(userId);

    removeModerator(userId)
        .then((updatedUser) => {
          setUsers((prevUsers) =>
              prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
          );
        })
        .catch(() => setError(t('unexpectedErrorRemovingModerator')))
        .finally(() => setProcessingUserId(null));
  }

  function roleLabel(role: number): string {
    switch (role) {
      case 1:
        return t('roleAdmin');
      case 2:
        return t('roleModerator');
      default:
        return t('roleUser');
    }
  }

  return (
      <div className="flex">
        <LeftPanel />
        <div className="flex-1 p-6">
          <h1 className="text-xl font-semibold mb-4">{t('registeredUsers')}</h1>

          {loading && <p>{t('loadingUsers')}</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('emailColumn')}</TableHead>
                      <TableHead>{t('firstNameColumn')}</TableHead>
                      <TableHead>{t('lastNameColumn')}</TableHead>
                      <TableHead>{t('roleColumn')}</TableHead>
                      <TableHead>{t('actionColumn')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="py-2">{user.email}</TableCell>
                          <TableCell className="py-2">{user.firstName}</TableCell>
                          <TableCell className="py-2">{user.lastName}</TableCell>
                          <TableCell className="py-2">{roleLabel(user.role)}</TableCell>
                          <TableCell className="py-2">
                            {user.role === 0 && (
                                <Button
                                    size="sm"
                                    disabled={processingUserId === user.id}
                                    onClick={() => handleAssignModerator(user.id)}
                                >
                                  {processingUserId === user.id
                                      ? t('assigning')
                                      : t('makeModerator')}
                                </Button>
                            )}
                            {user.role === 2 && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={processingUserId === user.id}
                                    onClick={() => handleRemoveModerator(user.id)}
                                >
                                  {processingUserId === user.id
                                      ? t('processing')
                                      : t('makeNormalUser')}
                                </Button>
                            )}
                            {user.role === 1 && (
                                <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
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
                                {t('pageOf', { page, totalPages })}
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
      </div>
  );
}