import { useEffect, useState } from 'react';
import { getCookie } from '@/shared/utils/cookies';
import { assignModerator, getUsers } from '@/features/admin/api/adminApi';
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
  PaginationLink,
} from '@/components/ui/pagination';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { LeftPanel } from '@/features/homepage/components/LeftPanel';
import { Input } from '@base-ui/react';

const PAGE_SIZE = 10;

type SortColumn = 'email' | 'firstName' | 'lastName';


export function UsersListPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningModeratorId, setAssigningModeratorId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortColumn>('email');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [sortDescending, setSortDescending] = useState<boolean>(false);
 
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const roleFilterValue = roleFilter === '' ? undefined : Number(roleFilter);
    getUsers(page, PAGE_SIZE, getCookie('authToken')!, searchTerm, sortBy, roleFilterValue, sortDescending)
      .then((result) => {
        setUsers(result.items);
        setTotalCount(result.totalCount);
      })
      .catch(() => setError(t('unexpectedErrorLoadingUsers')))
      .finally(() => setLoading(false));
  }, [page, searchTerm, sortBy, sortDescending, roleFilter]);
  
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function handleAssignModerator(userId: string) {
    setAssigningModeratorId(userId);

    assignModerator(userId, getCookie('authToken')!)
      .then((updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
      })
      .catch(() => setError(t('unexpectedErrorAssigningModerator')))
      .finally(() => setAssigningModeratorId(null));
  }

  function roleLabel(role: number): string {
    switch (role) {
      case 1:
        return t('admin');
      case 2:
        return t('moderator');
      default:
        return t('user');
    }
  }

  function handleSort(column: SortColumn) {
    if (sortBy === column) {
      setSortDescending((prev) => !prev);
    } else {
      setSortBy(column);
      setSortDescending(false);
    }
    setPage(1);
  }

  function SortIcon({ column }: { column: SortColumn }) {
    if (sortBy !== column){
      return <ChevronUpIcon className="inline w-3 h-3 ml-1 opacity-30" />;
    }
    return sortDescending ? <ChevronDownIcon className="w-4 h-4 inline" /> : <ChevronUpIcon className="w-4 h-4 inline" />;
  }
  return (
    <div className="flex">
      <LeftPanel />
      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-4">{t('registeredUsers')}</h1>

        <Input
          type="text"
          placeholder={t('searchUsers')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="mb-4 max-w-xs"
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">{t('allRoles')}</option>
            <option value="1">{t('admin')}</option>
            <option value="2">{t('moderator')}</option>
            <option value="0">{t('user')}</option>
          </select>
          
        {loading && <p>{t('loadingUsers')}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                    {t('emailColumn')} {<SortIcon column="email" />}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('firstName')}>
                    {t('firstNameColumn')} {<SortIcon column="firstName" />}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('lastName')}>
                    {t('lastNameColumn')} {<SortIcon column="lastName" />}
                  </TableHead>
                  <TableHead>{t('roleColumn')}</TableHead>
                  <TableHead>{t('actionColumn')} </TableHead>
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
                    {user.role == 0 ? (
                      <Button
                        size="sm"
                        disabled={assigningModeratorId === user.id}
                        onClick={() => handleAssignModerator(user.id)}
                        >
                          {assigningModeratorId === user.id ? t('assigning') : t('makeModerator')}
                        </Button>
                    ) : (
                      <span className='text-sm text-muted-foreground'>-</span>
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