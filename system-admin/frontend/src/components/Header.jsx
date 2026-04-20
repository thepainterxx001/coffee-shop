import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className='flex w-full justify-between p-8 flex-col md:flex-row gap-2'>
      <h1 className='text-3xl text-b2 font-mono italic'>Tahanan Brew</h1>
      <div className='flex items-center justify-between bg-g1 py-1 px-3 rounded-lg w-full md:w-[25vw]'>
        <input type="text" placeholder="Search"
        className='text-b1 border-none outline-none placeholder-b1 w-full' />
        <Search size={18} color='#47342E' />
      </div>
    </header>
  )
}

export default Header