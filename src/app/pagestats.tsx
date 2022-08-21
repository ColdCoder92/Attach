import { createEffect, createResource, createSignal, onMount, Show } from 'solid-js';
import { colors } from '../config';

const fetchStat = async (path: string) => {
    const res = await fetch(`/${path}`);
    const json = await res.json();
    const amount = json[path];
    localStorage.setItem(path, amount);
    return amount;
};

const PageStats = () => {
    const page_views_LS = localStorage.getItem("page_views");
    const likes_LS = localStorage.getItem("likes");
    const [page_views] = createResource("page_views", fetchStat);
    const [likes, { mutate }] = createResource("likes", fetchStat);
    const liked_LS = localStorage.getItem("liked");
    const [liked, setLiked] = createSignal(typeof liked_LS === "string" ? JSON.parse(liked_LS) : false);

    createEffect(() => {
        localStorage.setItem("liked", liked());
    });

    return (
        <div class="pb-3 flex gap-3 justify-center">
            <div class={`w-full h-[50px] flex items-center justify-center font-bold rounded-lg leading-5 px-4 ${colors.bg.links}`}>
                <Show when={!page_views.loading} fallback={<>{page_views_LS} Views</>}>
                    {page_views()} Views
                </Show>
            </div>
            <div class={`w-full h-[50px] flex items-center justify-center font-bold rounded-lg leading-5 px-4 ${colors.bg.links}`}>
                <Show when={!likes.loading} fallback={<>{likes_LS} Likes</>}>
                    {likes()} Likes
                </Show>
            </div>
            <button class={`w-full h-[50px] flex items-center justify-center rounded-lg leading-5 px-4 ${colors.bg.button} transition-all
                    hover:shadow-[1px_1px_2px_4px_rgba(0,0,0,0.25)] active:shadow-[inset_1px_1px_0px_2px_rgba(0,0,0,0.5)] shadow-[1px_1px_0px_2px_rgba(0,0,0,0.1)]`} onClick={() => {
                    const new_status = !(Boolean(liked()));
                    setLiked(new_status);
                    navigator.sendBeacon("/likes", new_status + "");
                    mutate(new_status ? likes() + 1 : (likes() > 0 ? likes() - 1 : 0));
                }}>
                {!Boolean(liked()) && <Heart />}
                {Boolean(liked()) && <BrokenHeart />}
            </button>
        </div>
    );
};

const Heart = () => {
    return (
        <svg viewBox="0 0 490 490" class={`${colors.arrow.download}`} width="25px">
            <path id="XMLID_25_" d="M316.554,108.336c4.553,6.922,2.629,16.223-4.296,20.774c-3.44,2.261-6.677,4.928-9.621,7.929  c-2.938,2.995-6.825,4.497-10.715,4.497c-3.791,0-7.585-1.427-10.506-4.291c-5.917-5.801-6.009-15.298-0.207-21.212  c4.439-4.524,9.338-8.559,14.562-11.992C302.698,99.491,312.002,101.414,316.554,108.336z M447.022,285.869  c-1.506,1.536-148.839,151.704-148.839,151.704C283.994,452.035,265.106,460,245,460s-38.994-7.965-53.183-22.427L42.978,285.869  c-57.304-58.406-57.304-153.441,0-211.847C70.83,45.634,107.882,30,147.31,30c36.369,0,70.72,13.304,97.69,37.648  C271.971,43.304,306.32,30,342.689,30c39.428,0,76.481,15.634,104.332,44.021C504.326,132.428,504.326,227.463,447.022,285.869z   M425.596,95.028C403.434,72.44,373.991,60,342.69,60c-31.301,0-60.745,12.439-82.906,35.027c-1.122,1.144-2.129,2.533-3.538,3.777  c-7.536,6.654-16.372,6.32-22.491,0c-1.308-1.352-2.416-2.633-3.538-3.777C208.055,72.44,178.612,60,147.31,60  c-31.301,0-60.744,12.439-82.906,35.027c-45.94,46.824-45.94,123.012,0,169.836c1.367,1.393,148.839,151.704,148.839,151.704  C221.742,425.229,233.02,430,245,430c11.98,0,23.258-4.771,31.757-13.433l148.839-151.703l0,0  C471.535,218.04,471.535,141.852,425.596,95.028z M404.169,116.034c-8.975-9.148-19.475-16.045-31.208-20.499  c-7.746-2.939-16.413,0.953-19.355,8.698c-2.942,7.744,0.953,16.407,8.701,19.348c7.645,2.902,14.521,7.431,20.436,13.459  c23.211,23.658,23.211,62.153,0,85.811l-52.648,53.661c-5.803,5.915-5.711,15.412,0.206,21.212  c2.921,2.863,6.714,4.291,10.506,4.291c3.889,0,7.776-1.502,10.714-4.497l52.648-53.661  C438.744,208.616,438.744,151.275,404.169,116.034z" />
        </svg>
    );
};

const BrokenHeart = () => {
    return (
        <svg viewBox="0 0 459.352 459.352" class={`${colors.arrow.download}`} width="30px">
            <g>
                <path d="M423.112,78.445c-23.37-23.369-54.442-36.24-87.495-36.24c-33.016,0-64.063,12.844-87.434,36.169   c-1.256,1.232-2.189,2.796-2.661,4.564c-0.813,3.05-0.128,6.215,1.691,8.617l20.906,29.178l-35.227,45.535   c-3.321,4.292-2.612,10.449,1.597,13.875l40.631,33.072l-34.548,45.27c-2.705,3.544-2.737,8.451-0.078,12.03l29.748,40.047   l-38.128,23.551c-2.601,1.606-4.324,4.314-4.678,7.35s0.7,6.068,2.861,8.229l41.204,41.205c1.881,1.881,4.431,2.929,7.074,2.929   c0.208,0,0.416-0.006,0.625-0.02c2.432-0.152,4.725-1.187,6.447-2.909l137.463-137.462c23.369-23.369,36.239-54.442,36.239-87.494   C459.352,132.887,446.481,101.814,423.112,78.445z M408.97,239.292L278.576,369.685l-25.198-25.198l36.645-22.634   c2.383-1.472,4.039-3.876,4.566-6.626s-0.124-5.596-1.794-7.845l-31.755-42.748l35.859-46.989   c3.277-4.293,2.552-10.413-1.637-13.822l-40.581-33.031l33.813-43.709c2.704-3.495,2.793-8.351,0.22-11.943l-20.259-28.275   c18.738-15.959,42.283-24.658,67.161-24.658c27.71,0,53.761,10.79,73.353,30.382s30.382,45.642,30.382,73.352   C439.352,193.65,428.562,219.7,408.97,239.292z" />
                <path d="M402.081,99.475c-9.246-9.246-20.031-16.329-32.054-21.052c-5.137-2.019-10.943,0.51-12.964,5.651   c-2.02,5.14,0.511,10.945,5.651,12.964c9.447,3.712,17.935,9.29,25.225,16.58c13.974,13.975,21.67,32.557,21.67,52.322   c0,19.766-7.696,38.347-21.67,52.322c-3.905,3.905-3.905,10.237,0,14.142c1.953,1.953,4.512,2.929,7.071,2.929   s5.118-0.976,7.071-2.929c17.751-17.752,27.527-41.355,27.527-66.464C429.609,140.832,419.833,117.228,402.081,99.475z" />
                <path d="M335.617,71.947c-7.737,0-15.427,0.938-22.854,2.786c-5.359,1.334-8.623,6.76-7.289,12.119   c1.132,4.548,5.212,7.587,9.696,7.587c0.8,0,1.612-0.097,2.423-0.299c5.85-1.456,11.914-2.194,18.024-2.194c5.522,0,10-4.477,10-10   S341.14,71.947,335.617,71.947z" />
                <path d="M202.357,344.487l36.645-22.634c2.383-1.472,4.039-3.875,4.566-6.626c0.527-2.751-0.124-5.596-1.794-7.845l-31.755-42.748   l35.86-46.989c3.277-4.294,2.552-10.413-1.637-13.823l-40.581-33.031l33.813-43.709c2.704-3.495,2.793-8.351,0.219-11.943   l-18.31-25.554c-8.916-12.444-19.833-22.557-32.45-30.06C138.281,30.59,76.313,38.371,36.239,78.445   C12.87,101.814,0,132.887,0,165.939c0,33.052,12.87,64.125,36.24,87.495l160.856,160.847c1.953,1.952,4.512,2.929,7.071,2.929   s5.119-0.976,7.071-2.929l23.222-23.222c0.888-0.847,1.628-1.867,2.165-3.026c1.767-3.807,0.967-8.311-2-11.279L202.357,344.487z    M204.166,393.068L50.381,239.292C30.79,219.7,20,193.65,20,165.939c0-27.71,10.79-53.76,30.382-73.352   c20.033-20.033,46.584-30.441,73.408-30.441c18.164,0,36.456,4.776,52.922,14.568c10.229,6.083,19.116,14.333,26.415,24.519   l13.973,19.501l-35.227,45.535c-3.32,4.292-2.611,10.449,1.597,13.875l40.631,33.072l-34.549,45.27   c-2.705,3.544-2.736,8.451-0.078,12.03l29.749,40.047l-38.129,23.55c-2.601,1.606-4.324,4.314-4.678,7.35s0.7,6.068,2.861,8.229   l34.133,34.132L204.166,393.068z" />
                <path d="M184.361,126.107c1.953,2.725,5.022,4.176,8.137,4.176c2.017,0,4.052-0.608,5.816-1.872   c4.489-3.217,5.521-9.464,2.304-13.953l-5.41-7.55c-6.511-9.087-14.409-16.428-23.476-21.82   c-8.403-4.997-17.522-8.633-27.104-10.806c-5.386-1.22-10.742,2.154-11.964,7.541c-1.221,5.386,2.155,10.742,7.541,11.964   c7.536,1.709,14.703,4.565,21.303,8.491c6.68,3.973,12.548,9.45,17.442,16.279L184.361,126.107z" />
                <path d="M112.153,72.648c-8.409,1.029-16.621,3.185-24.405,6.409c-5.103,2.113-7.526,7.963-5.413,13.065   c1.595,3.852,5.318,6.176,9.243,6.176c1.275,0,2.571-0.246,3.822-0.764c6.114-2.532,12.567-4.226,19.181-5.035   c5.482-0.671,9.382-5.658,8.711-11.14C122.623,75.878,117.641,71.977,112.153,72.648z" />
            </g>
        </svg>
    );
};

export default PageStats;