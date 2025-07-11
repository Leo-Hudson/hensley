import { loaderActions } from '@/store/loaderStore';
import { useRouter, usePathname } from 'next/navigation';

const useRedirectWithLoader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const redirectWithLoader = (slug, ignoreSamePath) => {
    if (pathname === slug && ignoreSamePath) {
      loaderActions.show();
      setTimeout(() => loaderActions.hide(), 900);
    } else {
      loaderActions.show();
      router.push(slug);
    }
  };

  return redirectWithLoader;
};

export default useRedirectWithLoader;
