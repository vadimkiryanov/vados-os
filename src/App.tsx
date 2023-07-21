import React, { useLayoutEffect } from 'react';
import { DraggableData, Rnd } from 'react-rnd';

/* 
Пока что это все в разработке, деления на компоненты и прочие нет, 
рефакторинг потом, как будет отработан функционал
*/

function App() {
  const [isAppActive, setIsAppActive] = React.useState<number | null>(null);

  const [windows, setWindows] = React.useState<TWindows[]>([]);

  const [activeWindow, setActiveWindow] = React.useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);

  const handleDragStop = (id: number, position: DraggableData) => {
    setWindows((prev) =>
      prev.map((window) => (window.id === id ? { ...window, x: position.x, y: position.y, xPrev: position?.x, yPrev: position?.y } : window))
    );
  };

  const handleResize = (id: number, size: { width: number | string; height: number | string }, position: { x: number; y: number } | undefined) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, width: size.width, height: size.height, ...position } : window)));
  };

  const handleMouseDown = (idx: number) => {
    setActiveWindow(idx);
  };

  //
  const handleFullScreen = (idx: number, element: TWindows, e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e?.preventDefault();
    if (!isFullScreen) {
      handleResize(idx, { width: '100%', height: '100%' }, { x: 0, y: 0 });
      setIsFullScreen(true);
    } else {
      handleResize(idx, { width: '60vw', height: '40vh' }, { x: element.xPrev!, y: element.yPrev! });
      setIsFullScreen(false);
    }
  };

  const handleMouseEnter = () => {
    setIsDragging(true);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // header actions
  const onCloseWindow = (winId: number) => {
    setWindows((prev) =>
      prev.filter((elem, id) => {
        return elem.id !== winId;
      })
    );
  };

  const onAddWindow = (newWindow: TAppsIcon) => {
    setWindows([
      ...windows,
      {
        id: Math.random(),
        width: 600,
        height: 400,
        x: window.innerWidth / 3,
        y: window.innerHeight / 8,
        xPrev: 0,
        yPrev: 0,
        content: newWindow.content,
      },
    ]);
  };

  return (
    <div className="h-screen w-screen grid place-items-center content-center bg-cover bg-[url('https://free4kwallpapers.com/uploads/originals/2022/04/20/rubiks-cube-digital-art-wallpaper.jpg')]">
      {windows.map((elem, idx) => {
        return (
          <Rnd
            key={idx}
            minWidth={300}
            minHeight={300}
            size={{ width: elem.width, height: elem.height }}
            position={{ x: elem.x, y: elem.y }}
            onDragStop={(e, d) => {
              handleDragStop(elem.id, d);
            }}
            onResize={(e, direction, ref, delta, position) => {
              handleResize(elem.id, { width: ref.offsetWidth, height: ref.offsetHeight }, position);
            }}
            className={activeWindow === elem.id ? 'z-50' : ''}
            disableDragging={isFullScreen || isDragging}
          >
            <section
              onMouseDown={() => handleMouseDown(elem.id)}
              className={`h-full ease-linear shadow-xl flex flex-col  rounded-lg cursor-auto transition-all relative`}
            >
              <div
                onDoubleClick={(e) => handleFullScreen(elem.id, elem, e)}
                className={`${
                  activeWindow === elem.id ? 'bg-gray-900' : 'bg-gray-800'
                } w-full h-12 rounded-t-lg  flex justify-start items-center space-x-1.5 px-4 transition-all relative  z-10`}
              >
                <button
                  onClick={() => onCloseWindow(elem.id)}
                  className="w-3 h-3 border-2  border-red-400 rounded-full hover:bg-red-400 bg-transparent "
                ></button>
                <button className="w-3 h-3 border-2  border-yellow-400 rounded-full hover:bg-yellow-400 bg-transparent"></button>
                <button
                  onClick={() => handleFullScreen(elem.id, elem)}
                  className="w-3 h-3 border-2  border-green-400 rounded-full hover:bg-green-400 bg-transparent"
                ></button>
              </div>

              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className=" bg-gray-700 border-t-0 w-full h-full  p-4 rounded-b-lg grid place-items-center  z-0 overflow-auto "
              >
                {elem.content()}
              </div>
            </section>
          </Rnd>
        );
      })}

      <div className="fixed  w-full bottom-0 flex-none z-10 flex justify-center shadow-lg bg-white bg-opacity-75 border-t border-gray-300 border-opacity-20 backdrop-filter backdrop-blur-lg px-56 dark:bg-gray-800 dark:bg-opacity-75 dark:backdrop-filter dark:backdrop-blur-lg dark:border-gray-600 dark:border-opacity-20">
        {/*   Apps  */}
        <nav className="flex items-center justify-center space-x-1 h-14">
          {appsIcon.map((app, index) => {
            return (
              <button
                key={app.id}
                onClick={() => {
                  isAppActive !== app.id ? setIsAppActive(app.id) : setIsAppActive(null);
                  onAddWindow(app);
                }}
                type="button"
                className="relative group focus:outline-none bg-white rounded transition duration-150 bg-opacity-0 hover:bg-opacity-50 active:bg-opacity-75 dark:bg-black dark:bg-opacity-0 dark:hover:bg-opacity-25 dark:active:bg-opacity-50"
              >
                {isAppActive === app.id && <span className="absolute bottom-0 left-0 right-0 mx-4 h-1 rounded bg-blue-500"></span>}
                <span className="block p-2 transform transition duration-75 active:scale-90">
                  <img className="relative w-8 h-8" src={app.image} alt="Start Menu" />
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default App;

const appsIcon: TAppsIcon[] = [
  {
    id: 1,
    image: 'img/icons/windows.png',
    content: () => <input type="range" min={0} max="100" value="40" />,
  },
  {
    id: 2,
    image: 'img/icons/desktop.png',
    content: () => (
      <select className="select w-full max-w-xs">
        <option disabled selected>
          Pick your favorite Simpson
        </option>
        <option>Homer</option>
        <option>Marge</option>
        <option>Bart</option>
        <option>Lisa</option>
        <option>Maggie</option>
      </select>
    ),
  },
  {
    id: 3,
    image: 'img/icons/computer-dark.png',
    content: () => (
      <div className="rating gap-1">
        <input type="radio" name="rating-3" className="mask mask-heart bg-red-400" />
        <input type="radio" name="rating-3" className="mask mask-heart bg-orange-400" checked />
        <input type="radio" name="rating-3" className="mask mask-heart bg-yellow-400" />
        <input type="radio" name="rating-3" className="mask mask-heart bg-lime-400" />
        <input type="radio" name="rating-3" className="mask mask-heart bg-green-400" />
      </div>
    ),
  },
  {
    id: 4,
    image: 'img/icons/edge.png',
    content: () => <iframe className="w-full h-full" src="https://daisyui.com/components/range/" title="Chat AI"></iframe>, //
  },
  {
    id: 5,
    image: 'img/icons/folder.png',
    content: () => (
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img
            src="https://media1.popsugar-assets.com/files/thumbor/r-H2D7LclaSMDAoEV9iBbODdRJs/fit-in/728xorig/filters:format_auto-!!-:strip_icc-!!-/2022/07/27/995/n/1922729/8d82874962e1c1ce7992d1.75767700_/i/best-nike-training-shoes.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    image: 'img/icons/store.png',
    content: () => (
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/luxjt6DrWbc"
        title="A Normal Day In ENGLAND"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    ),
  },
];

type TWindows = {
  id: number;
  width: number | string;
  height: number | string;
  x: number;
  y: number;
  xPrev: number | undefined;
  yPrev: number | undefined;
  content: () => React.JSX.Element;
};

type TAppsIcon = {
  id: number;
  image: string;
  content: () => React.JSX.Element;
};
